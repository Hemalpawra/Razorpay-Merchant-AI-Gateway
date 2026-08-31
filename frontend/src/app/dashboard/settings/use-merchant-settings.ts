import { useState, useEffect } from 'react';

export interface MerchantSettings {
  store_name?: string;
  business_name?: string;
  support_email?: string;
  support_phone?: string;
  store_description?: string;
  support_address?: string;
  ai_enabled?: boolean;
  ask_address?: boolean;
  ask_email?: boolean;
  ask_phone?: boolean;
  ask_payment_confirm?: boolean;
  ask_notes?: boolean;
  enable_upsell?: boolean;
  enable_cross_sell?: boolean;
  show_comparisons?: boolean;
  highlight_offers?: boolean;
  auto_create_order?: boolean;
  auto_capture_payment?: boolean;
  response_language?: string;
  response_style?: string;
  min_order?: string;
  max_order?: string;
  order_prefix?: string;
  approval_threshold?: string;
  max_discount?: string;
  tax_rate?: string;
  high_value_approval?: boolean;
  manual_review_new?: boolean;
  allow_discounts?: boolean;
  out_of_stock_order?: boolean;
  backorder?: boolean;
  show_stock?: boolean;
  checkout_mode?: string;
  guest_checkout?: boolean;
  auto_coupons?: boolean;
  req_name?: boolean;
  req_email?: boolean;
  req_phone?: boolean;
  req_address?: boolean;
  pay_cards?: boolean;
  pay_upi?: boolean;
  pay_netbanking?: boolean;
  pay_wallets?: boolean;
  pay_bnpl?: boolean;
  show_thumbnails?: boolean;
  editable_cart?: boolean;
  show_trust_badges?: boolean;
  // business-rules dropdowns
  store_currency?: string;
  timezone?: string;
  date_format?: string;
  tax_display?: string;
  tax_basis?: string;
  order_numbering?: string;
  // checkout-preferences dropdowns
  address_options?: string;
  default_payment_method?: string;
  phone_validation?: boolean;
  email_validation?: boolean;
  // access-profile
  profile_name?: string;
  profile_email?: string;
  profile_mobile?: string;
  two_factor?: boolean;
  default_dashboard_view?: string;
  // dummy-shipping
  shipping_enabled?: boolean;
  shipping_time?: string;
  business_days?: string;
  cutoff_time?: string;
  // notifications
  notification_events?: Array<{ name: string; email: boolean; sms: boolean; inApp: boolean }>;
  quiet_hours?: boolean;
}

export function useMerchantSettings() {
  const [settings, setSettings] = useState<MerchantSettings>({});
  const [merchant, setMerchant] = useState<{ id: string; display_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.merchant) {
          setMerchant({ id: data.merchant.id, display_name: data.merchant.display_name, email: data.merchant.email });
          setSettings((data.merchant.settings_json || {}) as MerchantSettings);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async (updates: Partial<MerchantSettings>) => {
    if (!merchant) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: merchant.id, settings_json: { ...settings, ...updates } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSettings(data.merchant.settings_json || {});
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return { settings, merchant, loading, saving, error, savedNotice, saveSettings };
}