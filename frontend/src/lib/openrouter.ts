/**
 * OpenRouter API Helper Utility for Free LLM Models
 * Supports openrouter/free models with fast timeout fallback
 */

export interface OpenChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  text: string;
  isFallback?: boolean;
  modelUsed?: string;
  rawJson?: any;
}

export async function callOpenRouterLLM(
  messages: OpenChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }
): Promise<OpenRouterResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const preferredModel = options?.model || process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

  if (!apiKey || apiKey.trim() === '') {
    return {
      text: '',
      isFallback: true,
      modelUsed: 'local-rag-fallback'
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s max timeout for fast UX

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': 'https://razorpay-merchant-ai-gateway.demo',
        'X-Title': 'Razorpay Merchant AI Gateway',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: preferredModel,
        messages: messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 500,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[OpenRouter API Error] ${response.status} ${response.statusText}: ${errText}`);
      return {
        text: '',
        isFallback: true,
        modelUsed: preferredModel
      };
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || '';

    return {
      text: replyText,
      isFallback: false,
      modelUsed: data.model || preferredModel,
      rawJson: data
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[OpenRouter Timeout/Fetch fallback triggered]');
    return {
      text: '',
      isFallback: true,
      modelUsed: 'local-rag-fallback'
    };
  }
}
