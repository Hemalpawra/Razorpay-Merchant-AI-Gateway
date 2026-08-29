import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get orders with session info
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        status,
        created_at,
        session_id,
        buyer_sessions (external_ai_name)
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Get sessions
    const { data: sessions } = await supabase
      .from('buyer_sessions')
      .select(`
        id,
        status,
        created_at,
        external_ai_name,
        cart_value
      `)
      .gte('created_at', startDate.toISOString());

    // Calculate metrics
    const paidOrders = (orders || []).filter((o: any) => o.status === 'paid');
    const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + Number(o.amount), 0);
    const totalOrders = paidOrders.length;

    // Revenue by source
    const revenueBySource: Record<string, number> = {
      'Human Customer': 0,
      'ChatGPT': 0,
      'Claude': 0,
      'Gemini': 0,
      'Grok': 0,
      'Merchant AI': 0
    };

    (orders || []).forEach((order: any) => {
      const source = (order as any).buyer_sessions?.external_ai_name || 'Human Customer';
      if (revenueBySource[source] !== undefined) {
        revenueBySource[source] += Number(order.amount);
      } else {
        revenueBySource['Merchant AI'] += Number(order.amount);
      }
    });

    // Orders by source
    const ordersBySource: Record<string, number> = {
      'Human Customer': 0,
      'ChatGPT': 0,
      'Claude': 0,
      'Gemini': 0,
      'Grok': 0,
      'Merchant AI': 0
    };

    (orders || []).forEach((order: any) => {
      const source = (order as any).buyer_sessions?.external_ai_name || 'Human Customer';
      if (ordersBySource[source] !== undefined) {
        ordersBySource[source]++;
      } else {
        ordersBySource['Merchant AI']++;
      }
    });

    // Session to order funnel
    const totalSessions = sessions?.length || 0;
    const activeSessions = (sessions || []).filter((s: any) => 
      ['active', 'matching', 'awaiting_details', 'checking_out'].includes(s.status)
    ).length;
    const checkoutReady = (sessions || []).filter((s: any) => s.status === 'checkout_ready').length;
    const paidSessions = (orders || []).filter((o: any) => o.status === 'paid').length;

    const funnel = {
      sessions: totalSessions,
      active: activeSessions,
      checkoutReady,
      paid: paidSessions,
      conversionRate: totalSessions > 0 
        ? ((paidSessions / totalSessions) * 100).toFixed(1) 
        : '0'
    };

    // Revenue over time (group by day)
    const revenueByDay: Record<string, number> = {};
    (orders || []).forEach((order: any) => {
      if (order.status === 'paid') {
        const date = new Date(order.created_at).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        });
        revenueByDay[date] = (revenueByDay[date] || 0) + Number(order.amount);
      }
    });

    // Orders over time
    const ordersByDay: Record<string, number> = {};
    (orders || []).forEach((order: any) => {
      if (order.status === 'paid') {
        const date = new Date(order.created_at).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        });
        ordersByDay[date] = (ordersByDay[date] || 0) + 1;
      }
    });

    // Top products
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        price,
        order_items (
          quantity,
          orders (
            status,
            amount
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    const productStats = (products || []).map((product: any) => {
      const soldQuantity = (product as any).order_items
        ?.filter((item: any) => item.orders?.status === 'paid')
        ?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
      
      const revenue = (product as any).order_items
        ?.filter((item: any) => item.orders?.status === 'paid')
        ?.reduce((sum: number, item: any) => sum + Number(item.orders?.amount) / ((product as any).order_items?.filter((i: any) => i.orders?.status === 'paid').length || 1), 0) || 0;

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        orders: soldQuantity,
        revenue,
        conversionRate: totalSessions > 0 
          ? ((soldQuantity / totalSessions) * 100).toFixed(1)
          : '0'
      };
    }).sort((a: any, b: any) => b.revenue - a.revenue);

    // Get upsell data from audit logs
    const { data: upsellEvents } = await supabase
      .from('audit_logs')
      .select('meta_json')
      .eq('event_type', 'upsell_shown')
      .gte('created_at', startDate.toISOString());

    const upsellRevenue = (upsellEvents || []).reduce((sum: number, event: any) => {
      return sum + (Number(event.meta_json?.upsell_amount) || 0);
    }, 0) || 0;

    // Generate insights
    const insights = [];

    // Best selling AI product
    const aiOrderedProducts = productStats.filter((p: any) => p.orders > 0);
    if (aiOrderedProducts.length > 0) {
      insights.push({
        type: 'best_selling_ai',
        title: 'Best Selling AI Product',
        description: aiOrderedProducts[0].name,
        metric: `${aiOrderedProducts[0].orders} orders`,
        action: 'Consider featuring this product more prominently'
      });
    }

    // Missed revenue from out of stock
    const { data: outOfStockProducts } = await supabase
      .from('products')
      .select('name, sku, price')
      .eq('stock', 0);

    if (outOfStockProducts && outOfStockProducts.length > 0) {
      const missedRevenue = (outOfStockProducts || []).reduce((sum: number, p: any) => sum + Number(p.price), 0);
      insights.push({
        type: 'out_of_stock',
        title: 'Out of Stock Alert',
        description: `${outOfStockProducts.length} products unavailable`,
        metric: `₹${missedRevenue.toLocaleString('en-IN')} potential revenue`,
        action: 'Restock to capture missed sales'
      });
    }

    // Low conversion products
    const lowConversionProducts = productStats.filter((p: any) => 
      Number(p.conversionRate) < 5 && p.orders === 0
    );
    if (lowConversionProducts.length > 0) {
      insights.push({
        type: 'low_conversion',
        title: 'Low Conversion Products',
        description: lowConversionProducts.slice(0, 2).map((p: any) => p.name).join(', '),
        metric: `${lowConversionProducts.length} products`,
        action: 'Consider improving product description or images'
      });
    }

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrders,
        aiConversionRate: totalSessions > 0 
          ? ((paidSessions / totalSessions) * 100).toFixed(1)
          : '0',
        upsellRevenue,
        period
      },
      revenueBySource,
      ordersBySource,
      funnel,
      revenueByDay: Object.entries(revenueByDay).map(([date, amount]) => ({ date, amount })),
      ordersByDay: Object.entries(ordersByDay).map(([date, count]) => ({ date, count })),
      topProducts: productStats.slice(0, 10),
      insights
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}