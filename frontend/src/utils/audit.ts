import { SupabaseClient } from '@supabase/supabase-js';

export type AuditEventType = 
  | 'request_received'
  | 'catalog_search_started'
  | 'catalog_search_completed'
  | 'product_selected'
  | 'product_created'
  | 'product_updated'
  | 'product_deleted'
  | 'budget_check_passed'
  | 'budget_check_failed'
  | 'details_missing'
  | 'approval_requested'
  | 'approval_received'
  | 'razorpay_order_created'
  | 'checkout_initiated'
  | 'payment_captured'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'order_completed'
  | 'order_updated'
  | 'order_cancelled'
  | 'session_updated'
  | 'catalog_imported'
  | 'merchant_settings_updated'
  | (string & {});

export interface AuditLogOptions {
  supabase: SupabaseClient;
  merchant_id: string;
  session_id?: string;
  order_id?: string;
  actor_type: 'system' | 'customer' | 'merchant' | 'ai_assistant' | string;
  event_type: AuditEventType;
  title: string;
  description?: string;
  result?: 'success' | 'failure' | 'info' | 'warning' | string;
  meta_json?: Record<string, any>;
}

export async function logAuditEvent(options: AuditLogOptions): Promise<void> {
  const { 
    supabase, merchant_id, session_id, order_id, 
    actor_type, event_type, title, description, result, meta_json 
  } = options;

  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        merchant_id,
        session_id: session_id || null,
        order_id: order_id || null,
        actor_type,
        event_type,
        title,
        description,
        result,
        meta_json
      });

    if (error) {
      console.error(`[Audit Log Error] Failed to write event '${event_type}':`, error);
    }
  } catch (err) {
    console.error(`[Audit Log Exception] Error during audit logging for '${event_type}':`, err);
  }
}
