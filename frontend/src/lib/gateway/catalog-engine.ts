import { createClient } from '@/utils/supabase/server';
import { callOpenRouterLLM, OpenChatMessage } from '@/lib/openrouter';
import { MerchantAuditService } from '@/utils/audit';

export type CatalogQueryMode = 'customer' | 'agent_to_agent';

export interface CatalogQueryOptions {
  message: string;
  session_id?: string | null;
  history?: Array<{ sender: string; text: string }>;
  mode?: CatalogQueryMode;
}

export interface CatalogQueryResult {
  session_id: string;
  reply: string;
  model_used: string;
  is_fallback: boolean;
  matched_products: Array<{
    id: string;
    sku: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image_url: string;
  }>;
}

export class CatalogGatewayEngine {
  /**
   * Process a catalog search query, performing RAG matching against Supabase DB
   * and generating a response using OpenRouter LLM.
   */
  static async processQuery(options: CatalogQueryOptions): Promise<CatalogQueryResult> {
    const { message, session_id, history = [], mode = 'customer' } = options;
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      throw new Error('Message cannot be empty.');
    }

    const supabase = await createClient();

    // 1. Get or register active merchant
    const { data: merchants } = await supabase.from('merchants').select('id').limit(1);
    const merchant_id = merchants && merchants.length > 0 ? merchants[0].id : 'm_demo_101';

    // 2. Ensure Buyer Session exists
    let activeSessionId = session_id;
    if (!activeSessionId) {
      const { data: sess, error: sessErr } = await supabase
        .from('buyer_sessions')
        .insert({
          merchant_id,
          external_ai_name: mode === 'agent_to_agent' ? 'External Buyer AI Agent' : 'Customer Store AI',
          buyer_request_text: cleanMessage,
          status: 'active'
        })
        .select('id')
        .single();

      if (!sessErr && sess) {
        activeSessionId = sess.id;
      }
    }

    // Log request audit event
    if (activeSessionId) {
      await MerchantAuditService.logA2ARequest(supabase, merchant_id, activeSessionId, cleanMessage);
    }

    // 3. Fetch Products from Supabase DB (RAG Context)
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active');

    const productsList: any[] = dbProducts || [];

    // Parse max budget from prompt if present (e.g. "under 5000", "under ₹5,000", "below 60000")
    let maxBudget: number | null = null;
    const budgetMatch = cleanMessage.match(/(?:under|below|budget|less than|<|₹|\s)\s*₹?\s*(\d+[\d,]*)/i);
    if (budgetMatch && budgetMatch[1]) {
      const numStr = budgetMatch[1].replace(/,/g, '');
      const parsed = parseInt(numStr, 10);
      if (!isNaN(parsed) && parsed > 100) {
        maxBudget = parsed;
      }
    }

    const lower = cleanMessage.toLowerCase();
    const isGreeting = /^(hi|hello|hey|greetings|good morning|good evening|who are you)/i.test(lower);

    let matchedProducts: any[] = [];

    if (!isGreeting) {
      // Keyword matching across name, category, and description
      const keywords = lower
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'under', 'below', 'show', 'need', 'want', 'buy'].includes(w));

      matchedProducts = productsList.filter(p => {
        const pPrice = Number(p.price);
        if (maxBudget !== null && pPrice > maxBudget) return false;

        if (keywords.length === 0) return true;

        const nameLower = (p.name || '').toLowerCase();
        const catLower = (p.category || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();

        return keywords.some(kw => nameLower.includes(kw) || catLower.includes(kw) || descLower.includes(kw));
      });
    }

    // Fallback matching to top products if no exact keyword match was found
    if (matchedProducts.length === 0) {
      if (maxBudget !== null) {
        matchedProducts = productsList.filter(p => Number(p.price) <= maxBudget).slice(0, 3);
      }
      if (matchedProducts.length === 0) {
        matchedProducts = productsList.slice(0, 3);
      }
    } else {
      matchedProducts = matchedProducts.slice(0, 4);
    }

    // 4. OpenRouter LLM Prompt
    const catalogContextStr = productsList
      .map(p => `- ${p.name} (Category: ${p.category}, Price: ₹${p.price}, SKU: ${p.sku})`)
      .join('\n');

    const systemPrompt = `You are ElectroStore Merchant AI Gateway Assistant.
You are helping ${mode === 'agent_to_agent' ? 'an external Buyer AI Agent' : 'a customer'} find products and complete instant Razorpay checkouts.
Current Active Merchant Catalog:\n${catalogContextStr}

Instructions:
- Be warm, helpful, concise, and professional.
- Focus on answering questions using the merchant's catalog products.
- Always include accurate prices in INR (₹).
- Mention that purchases can be completed instantly via Razorpay Checkout.`;

    const openRouterMessages: OpenChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map((h: any) => ({
        role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: h.text
      })),
      { role: 'user', content: cleanMessage }
    ];

    // Call OpenRouter LLM helper
    const llmResult = await callOpenRouterLLM(openRouterMessages);
    let replyText = llmResult.text;
    const modelUsed = llmResult.modelUsed || 'local-rag-fallback';

    if (!replyText || llmResult.isFallback) {
      if (isGreeting) {
        replyText = `Hello! 👋 I'm your Merchant AI Assistant. How can I help you find products or complete a purchase today? Here are our top featured items ready for instant Razorpay Checkout:`;
      } else if (maxBudget !== null) {
        replyText = `Here are top recommendations from our active catalog under ₹${maxBudget.toLocaleString('en-IN')}:`;
      } else {
        replyText = `I searched our live Merchant AI Gateway catalog and found matching options for "${cleanMessage}":`;
      }
    }

    // Log completion audit event
    if (activeSessionId) {
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id,
        session_id: activeSessionId,
        actor_type: 'ai_assistant',
        event_type: 'catalog_search_completed',
        title: `AI Gateway Response Generated (${modelUsed})`,
        description: `Found ${matchedProducts.length} matched product(s).`,
        result: 'success',
        meta_json: { model_used: modelUsed, max_budget: maxBudget }
      });
    }

    return {
      session_id: activeSessionId || 'sess_demo',
      reply: replyText,
      model_used: modelUsed,
      is_fallback: llmResult.isFallback ?? false,
      matched_products: matchedProducts.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category || 'General',
        price: Number(p.price),
        stock: p.stock_qty || 10,
        description: p.description || '',
        image_url: p.image_url || '/store/p-headphones.jpg'
      }))
    };
  }
}
