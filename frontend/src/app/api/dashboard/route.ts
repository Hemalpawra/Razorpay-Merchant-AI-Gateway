import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface OrderRecord {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  session_id: string;
  buyer_sessions?: any;
}

interface SessionRecord {
  id: string;
  status: string;
  created_at: string;
  external_ai_name?: string;
  cart_value?: number;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'needs-action': {
        const [waitingPayment, humanHelp, outOfStock, abandoned] = await Promise.all([
          supabase
            .from('orders')
            .select('id, amount, customer_name, product_name, created_at')
            .eq('payment_status', 'Pending')
            .or('status.eq.Processing,status.eq.Pending Payment')
            .limit(3),
          
          supabase
            .from('buyer_sessions')
            .select('id, customer_name, message, created_at')
            .eq('needs_human_help', true)
            .is('claimed_by', null)
            .limit(3),
          
          supabase
            .from('products')
            .select('id, name, sku, stock')
            .eq('stock', 0)
            .limit(3),
          
          supabase
            .from('buyer_sessions')
            .select('id, customer_name, cart_value, last_activity')
            .gt('cart_value', 1000)
            .lt('last_activity', new Date(Date.now() - 60 * 60 * 1000).toISOString())
            .is('claimed_by', null)
            .limit(3)
        ]);

        const needsAction = [
          ...(waitingPayment.data || []).map((item: any) => ({
            id: item.id,
            type: 'waiting-payment',
            title: `Waiting for payment: ₹${Number(item.amount).toFixed(2)}`,
            description: `Customer: ${item.customer_name}`,
            timestamp: item.created_at,
            priority: 'high',
            action: {
              label: 'Retry Payment',
              url: `/dashboard/orders?order=${item.id}`
            }
          })),
          ...(humanHelp.data || []).map((item: any) => ({
            id: item.id,
            type: 'human-help',
            title: 'Customer requested human help',
            description: `Message: ${(item.message || '').substring(0, 50)}...`,
            timestamp: item.created_at,
            priority: 'high',
            action: {
              label: 'View Conversation',
              url: `/dashboard/ai-agent?session=${item.id}`
            }
          })),
          ...(outOfStock.data || []).map((item: any) => ({
            id: item.id,
            type: 'out-of-stock',
            title: `Out of stock: ${item.name}`,
            description: `SKU: ${item.sku}`,
            timestamp: new Date().toISOString(),
            priority: 'medium',
            action: {
              label: 'Restock Product',
              url: `/dashboard/products?sku=${item.sku}`
            }
          })),
          ...(abandoned.data || []).map((item: any) => ({
            id: item.id,
            type: 'abandoned-cart',
            title: `High-value abandoned cart: ₹${Number(item.cart_value).toFixed(2)}`,
            description: `Customer: ${item.customer_name}`,
            timestamp: item.last_activity,
            priority: 'medium',
            action: {
              label: 'Recover Cart',
              url: `/dashboard/ai-agent?session=${item.id}`
            }
          }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        return NextResponse.json({ needsAction });
      }

      case 'recent-activity': {
        const { data: activities } = await supabase
          .from('audit_logs')
          .select(`
            id,
            event_type,
            title,
            description,
            actor_type,
            result,
            created_at,
            order_id,
            session_id,
            meta_json
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        const recentActivity = (activities || []).map((item: any) => ({
          id: item.id,
          time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: item.title,
          source: item.actor_type === 'ai' ? 'AI Agent' : 
                 item.actor_type === 'customer' ? 'Human Customer' : 
                 item.actor_type === 'merchant' ? 'Merchant' : 'System',
          status: item.result === 'success' ? 'Success' : 
                  item.result === 'failed' ? 'Failed' : 'Warning',
          action: item.event_type.includes('order') ? 'View Order' : 
                  item.event_type.includes('session') ? 'View Conversation' : 
                  item.event_type.includes('product') ? 'View Product' : 'Details'
        }));

        return NextResponse.json({ recentActivity });
      }

      case 'ai-readiness': {
        const [aiSessions, pendingActions, systemHealth] = await Promise.all([
          supabase
            .from('buyer_sessions')
            .select('id, status')
            .in('status', ['active', 'awaiting_customer_response', 'checking_out'])
            .limit(1),
          
          supabase
            .from('orders')
            .select('id')
            .eq('payment_status', 'Pending')
            .limit(1),
          
          supabase
            .from('merchants')
            .select('id')
            .limit(1)
        ]);

        const isReady = (aiSessions.data?.length ?? 0) > 0 || (systemHealth.data?.length ?? 0) > 0;

        return NextResponse.json({
          ready: isReady,
          activeConversations: aiSessions.data?.length || 0,
          pendingActions: pendingActions.data?.length || 0,
          lastChecked: new Date().toISOString()
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}