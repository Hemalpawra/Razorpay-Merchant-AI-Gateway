'use client';

import React, { useState, useEffect } from 'react';
import { Box, Text, Badge, Skeleton } from '@razorpay/blade/components';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const SALES_DATA = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 62 },
    { label: 'Wed', value: 38 },
    { label: 'Thu', value: 71 },
    { label: 'Fri', value: 55 },
    { label: 'Sat', value: 80 },
    { label: 'Sun', value: 47 },
  ];

  const NEEDS_ATTENTION = [
    { title: 'Out of Stock Products', icon: 'box', color: '#D92D20', bgColor: '#FEF3F2', count: 8 },
    { title: 'Products Without Images', icon: 'image', color: '#D92D20', bgColor: '#FEF3F2', count: 5 },
    { title: 'Low Stock Alerts', icon: 'alert', color: '#DD6B20', bgColor: '#FFFAF0', count: 12 },
    { title: 'Pending Orders', icon: 'clock', color: '#305EFF', bgColor: '#EFF4FF', count: 4 },
    { title: 'Refund Requests', icon: 'refresh', color: '#DD6B20', bgColor: '#FFFAF0', count: 3 },
  ];

  const RECENT_ACTIVITY = [
    { time: '10:32 AM', event: 'Order Created', status: 'success' as const },
    { time: '10:28 AM', event: 'Payment Successful', status: 'success' as const },
    { time: '10:24 AM', event: 'Products Compared', status: 'success' as const },
    { time: '10:20 AM', event: 'Upsell Shown', status: 'success' as const },
    { time: '10:16 AM', event: 'Payment Failed', status: 'failed' as const },
  ];

  const AttentionIcon = ({ icon, color }: { icon: string; color: string }) => {
    const icons: Record<string, React.ReactNode> = {
      box: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 2.25L6 0.75L1.5 2.25L6 3.75L10.5 2.25Z" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.5 2.25V5.25L6 6.75L1.5 5.25V2.25" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 6.75V9.75L1.5 8.25" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.5 5.25V8.25L6 9.75" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      image: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.5" y="1.5" width="9" height="9" rx="1" stroke={color} strokeWidth="1"/>
          <circle cx="4.5" cy="4.5" r="1" stroke={color} strokeWidth="1"/>
          <path d="M1.5 8.25L3.75 6L5.25 7.5L7.5 5.25L10.5 8.25" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      alert: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.25 2.25L1.5 9.75H10.5L6.75 2.25H5.25Z" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 5.25V6.75" stroke={color} strokeWidth="1" strokeLinecap="round"/>
          <circle cx="6" cy="8.25" r="0.375" fill={color}/>
        </svg>
      ),
      clock: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="4.5" stroke={color} strokeWidth="1"/>
          <path d="M6 3V6L8.25 7.5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        </svg>
      ),
      refresh: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 6C1.5 3.515 3.515 1.5 6 1.5C7.933 1.5 9.583 2.767 10.233 4.5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
          <path d="M10.5 6C10.5 8.485 8.485 10.5 6 10.5C4.067 10.5 2.417 9.233 1.767 7.5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
          <path d="M10.5 3V4.5H9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.5 9V7.5H3" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    };
    return <>{icons[icon] || null}</>;
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 24px', backgroundColor: '#F8FAFC', minHeight: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton width="200px" height="40px" />
          <Skeleton width="100%" height="80px" />
          <Skeleton width="100%" height="400px" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px', backgroundColor: '#F8FAFC', minHeight: '100%' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, width: '100%' }}>
        {/* Left: Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: '#050505', fontFamily: 'Poppins, sans-serif', margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 16, color: '#616D75', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            Get a real-time overview of your AI commerce performance.
          </p>
        </div>

        {/* Right: Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Date Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #6C849D2E' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="#40566D" strokeWidth="1.25"/>
              <path d="M2 6.5H14" stroke="#40566D" strokeWidth="1.25"/>
              <path d="M5.5 1.5V3.5" stroke="#40566D" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M10.5 1.5V3.5" stroke="#40566D" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 13, color: '#40566D', fontFamily: 'Inter, sans-serif' }}>
              Jul 23, 2026 → Jul 30, 2026
            </span>
          </div>

          {/* Calendar Icon */}
          <div style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #6C849D2E', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.667 7.333H3.333M12.667 10H3.333M12.667 4.667H3.333M12.667 12.667H3.333" stroke="#616D75" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M1.333 12.667V4.667C1.333 3.933 1.933 3.333 2.667 3.333H13.333C14.067 3.333 14.667 3.933 14.667 4.667V12.667" stroke="#616D75" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Refresh Icon */}
          <div style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #6C849D2E', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 8C14 11.314 11.314 14 8 14C4.686 14 2 11.314 2 8C2 4.686 4.686 2 8 2C10.21 2 12.117 3.232 13.147 5.03" stroke="#616D75" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M14 2V5H11" stroke="#616D75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Export Button */}
          <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #6C849D2E', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 10V13.333H4V10" stroke="#305EFF" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 2V10M8 10L5.333 7.333M8 10L10.667 7.333" stroke="#305EFF" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#305EFF', fontFamily: 'Inter, sans-serif' }}>
              Export
            </span>
          </div>

          {/* Avatar */}
          <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#305EFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
              A
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, width: '100%' }}>
        {[
          { title: 'Total Revenue', value: '₹2,45,890', change: '+12.5%', positive: true },
          { title: 'Orders', value: '1,247', change: '+8.2%', positive: true },
          { title: 'Conversations', value: '3,891', change: '+15.3%', positive: true },
          { title: 'Products', value: '156', change: '+3.1%', positive: true },
          { title: 'Conversion Rate', value: '4.2%', change: '+0.8%', positive: true },
        ].map((stat, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, border: '1px solid #6C849D2E', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#607092', fontFamily: 'Inter, sans-serif' }}>{stat.title}</span>
            <span style={{ fontSize: 24, fontWeight: 600, color: '#050505', fontFamily: 'Poppins, sans-serif' }}>{stat.value}</span>
            <span style={{ fontSize: 12, color: '#00A251', fontFamily: 'Inter, sans-serif' }}>{stat.change}</span>
          </div>
        ))}
      </div>

      {/* 3-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 13, width: '100%' }}>
        {/* Column 1: Overview */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #6C849D2E', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#050505', fontFamily: 'Inter, sans-serif' }}>Overview</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#305EFF', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>Details</span>
          </div>

          {/* Sales Performance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#40566D', fontFamily: 'Inter, sans-serif' }}>Sales Performance</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 24, fontWeight: 600, color: '#050505', fontFamily: 'Poppins, sans-serif' }}>78,540</span>
                <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Hanken Grotesk, sans-serif' }}>last 7 days</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 24, fontWeight: 600, color: '#050505', fontFamily: 'Poppins, sans-serif' }}>12,34,680</span>
                <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Hanken Grotesk, sans-serif' }}>last month</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Hanken Grotesk, sans-serif', width: 32 }}>₹15L</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', flex: 1, marginLeft: 8, height: 80 }}>
                {SALES_DATA.map((bar, i) => (
                  <div key={i} style={{ flex: 1, height: `${bar.value}%`, backgroundColor: '#305EFF', borderRadius: 4 }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Hanken Grotesk, sans-serif', width: 32 }}>₹10L</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', flex: 1, marginLeft: 8, height: 56 }}>
                {SALES_DATA.map((bar, i) => (
                  <div key={i} style={{ flex: 1, height: `${bar.value * 0.7}%`, backgroundColor: '#305EFF1A', borderRadius: 4 }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Hanken Grotesk, sans-serif', width: 32 }}>₹5L</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', flex: 1, marginLeft: 8, height: 32 }}>
                {SALES_DATA.map((bar, i) => (
                  <div key={i} style={{ flex: 1, height: `${bar.value * 0.4}%`, backgroundColor: '#305EFF0D', borderRadius: 4 }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Hanken Grotesk, sans-serif', width: 32 }}>₹0</span>
              <div style={{ display: 'flex', gap: 6, flex: 1, marginLeft: 8 }}>
                {SALES_DATA.map((bar, i) => (
                  <div key={i} style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                ))}
              </div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 32 }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day} style={{ fontSize: 11, color: '#607092', fontFamily: 'Hanken Grotesk, sans-serif' }}>{day}</span>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: '#E5E7EB' }} />

          {/* Revenue Breakdown Donut */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#40566D', fontFamily: 'Inter, sans-serif' }}>Revenue Breakdown</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'UPI', color: '#00A251' },
                  { label: 'Netbanking', color: '#008743' },
                  { label: 'Cards', color: '#305EFF' },
                  { label: 'Wallets', color: '#768EA7' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: item.color }} />
                    <span style={{ fontSize: 12, color: '#40566D', fontFamily: 'Inter, sans-serif' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width: 100, height: 100, position: 'relative' }}>
              <svg viewBox="0 0 36 36" width="100" height="100">
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#E5E7EB" strokeWidth="3.8"/>
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#00A251" strokeWidth="3.8" strokeDasharray="45 55" strokeDashoffset="25"/>
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#008743" strokeWidth="3.8" strokeDasharray="30 70" strokeDashoffset="80"/>
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#305EFF" strokeWidth="3.8" strokeDasharray="15 85" strokeDashoffset="50"/>
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#768EA7" strokeWidth="3.8" strokeDasharray="10 90" strokeDashoffset="35"/>
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: '#E5E7EB' }} />

          {/* Transactions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#40566D', fontFamily: 'Inter, sans-serif' }}>Transactions</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#050505', fontFamily: 'Inter, sans-serif' }}>890</span>
          </div>

          {/* Top Selling Products */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#40566D', fontFamily: 'Inter, sans-serif' }}>Top Selling Products</span>
            {[
              { name: 'Wireless Earbuds Pro', orders: '324 orders', price: '₹1,29,600' },
              { name: 'Smart Watch Elite', orders: '189 orders', price: '₹94,500' },
              { name: 'USB-C Hub Adapter', orders: '156 orders', price: '₹46,800' },
            ].map((product, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#050505', fontFamily: 'Inter, sans-serif' }}>{product.name}</span>
                  <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Inter, sans-serif' }}>{product.orders}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#050505', fontFamily: 'Poppins, sans-serif' }}>{product.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: AI Performance */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #6C849D2E', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#050505', fontFamily: 'Inter, sans-serif' }}>AI Performance</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#305EFF', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>Details</span>
          </div>

          {/* 4 Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Sessions', value: '3,891', bg: '#EFF4FF' },
              { label: 'Product Views', value: '12,459', bg: '#FEF3F2' },
              { label: 'Add to Carts', value: '2,156', bg: '#FFFAF0' },
              { label: 'Checkouts', value: '1,089', bg: '#F0FDF4' },
            ].map((metric, i) => (
              <div key={i} style={{ backgroundColor: metric.bg, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Inter, sans-serif' }}>{metric.label}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#050505', fontFamily: 'Poppins, sans-serif' }}>{metric.value}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: '#E5E7EB' }} />

          {/* Conversion Funnel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#40566D', fontFamily: 'Inter, sans-serif' }}>Conversion Funnel</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Sessions', value: '3,891', percent: '100%' },
                { label: 'Product Views', value: '2,459', percent: '63.2%' },
                { label: 'Add to Carts', value: '1,156', percent: '29.7%' },
                { label: 'Checkouts', value: '589', percent: '15.1%' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: i === 0 ? '#305EFF' : i === 1 ? '#305EFFCC' : i === 2 ? '#305EFF99' : '#305EFF66', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#40566D', fontFamily: 'Inter, sans-serif', flex: 1 }}>{step.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#050505', fontFamily: 'Inter, sans-serif', width: 48, textAlign: 'right' }}>{step.value}</span>
                  <span style={{ fontSize: 11, color: '#607092', fontFamily: 'Hanken Grotesk, sans-serif', width: 40, textAlign: 'right' }}>{step.percent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Needs Attention */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #6C849D2E', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#050505', fontFamily: 'Inter, sans-serif' }}>Needs Attention</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#305EFF', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>View All</span>
          </div>

          {/* Attention Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NEEDS_ATTENTION.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: item.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AttentionIcon icon={item.icon} color={item.color} />
                </div>
                <span style={{ fontSize: 13, color: '#050505', fontFamily: 'Inter, sans-serif', flex: 1 }}>{item.title}</span>
                <div style={{ padding: '2px 8px', backgroundColor: item.bgColor, borderRadius: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: item.color, fontFamily: 'Inter, sans-serif' }}>{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Recent Activity + AI Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginTop: 13, width: '100%' }}>
        {/* Recent Activity */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #6C849D2E', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#050505', fontFamily: 'Inter, sans-serif' }}>Recent Activity</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#305EFF', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                <div style={{ width: 60, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: '#607092', fontFamily: 'Inter, sans-serif' }}>{activity.time}</span>
                </div>
                <span style={{ fontSize: 13, color: '#050505', fontFamily: 'Inter, sans-serif', flex: 1 }}>{activity.event}</span>
                <Badge color={activity.status === 'success' ? 'positive' : 'negative'} size="small">
                  {activity.status === 'success' ? 'Success' : 'Failed'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #6C849D2E', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#050505', fontFamily: 'Inter, sans-serif' }}>AI Insights</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#305EFF', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'Upsell Opportunity', desc: '89 customers viewed premium products but didn\'t add to cart', color: '#305EFF' },
              { title: 'Cart Recovery', desc: '23 abandoned carts with value over ₹5,000', color: '#DD6B20' },
              { title: 'Stock Alert', desc: '5 products are running low on inventory', color: '#D92D20' },
            ].map((insight, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${insight.color}17`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1.333l.907 2.053a1.333 1.333 0 001.04.747l2.26.193-1.7 1.487a1.333 1.333 0 00-.4 1.267l.52 2.18-1.787-1.174a1.333 1.333 0 00-1.466 0L6.42 9.26l.52-2.18a1.333 1.333 0 00-.4-1.267L4.833 4.333l2.26-.193a1.333 1.333 0 001.04-.747L8 1.333z" stroke={insight.color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#050505', fontFamily: 'Inter, sans-serif' }}>{insight.title}</span>
                  <span style={{ fontSize: 12, color: '#607092', fontFamily: 'Inter, sans-serif' }}>{insight.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
