'use client';

import React from 'react';
import {
  Box,
  Text,
  Drawer,
  DrawerHeader,
  DrawerBody,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { title: 'Dashboard', href: '/dashboard', icon: 'grid', group: 'core' },
  { title: 'Products', href: '/dashboard/products', icon: 'package', group: 'core' },
  { title: 'Product Import', href: '/dashboard/import', icon: 'upload', group: 'core' },
  { title: 'AI Agent', href: '/dashboard/ai-agent', icon: 'sparkles', group: 'core' },
  { title: 'Orders', href: '/dashboard/orders', icon: 'shopping-bag', group: 'core' },
  { title: 'Audit Trail', href: '/dashboard/audit-trail', icon: 'file-text', group: 'intelligence' },
  { title: 'Analytics', href: '/dashboard/analytics', icon: 'trending-up', group: 'intelligence' },
  { title: 'Settings', href: '/dashboard/settings', icon: 'settings', group: 'settings' },
];

const NavIcon = ({ icon, isActive }: { icon: string; isActive: boolean }) => {
  const color = isActive ? '#fff' : 'rgba(255,255,255,0.55)';
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.333 2.167a.833.833 0 01.834-.834h3.332a.833.833 0 01.834.834v3.333a.833.833 0 01-.834.834H2.167a.833.833 0 01-.834-.834V2.167zm0 8.333a.833.833 0 01.834-.834h3.332a.833.833 0 01.834.834v3.333a.833.833 0 01-.834.834H2.167a.833.833 0 01-.834-.834v-3.333zm6.667-8.333a.833.833 0 01.833-.834h3.334a.833.833 0 01.833.834v3.333a.833.833 0 01-.833.834H8.833a.833.833 0 01-.833-.834V2.167zm0 8.333a.833.833 0 01.833-.834h3.334a.833.833 0 01.833.834v3.333a.833.833 0 01-.833.834H8.833a.833.833 0 01-.833-.834v-3.333z" fill={color}/>
      </svg>
    ),
    package: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.167 3.833L8.5 1.083a1.667 1.667 0 00-1.334 0L1.833 3.833c-.45.225-.75.667-.75 1.167v7.5c0 .5.3 1.008.75 1.167l5.333 2.666c.2.1.417.15.625.15s.425-.05.625-.15L14.167 13.667c.45-.225.75-.667.75-1.167V5c0-.5-.3-1.008-.75-1.167z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    upload: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.167 10v2.667A1.334 1.334 0 0111.833 14H4.167a1.334 1.334 0 01-1.334-1.333V10M11.333 5.333L8 2M8 2L4.667 5.333M8 2v8.667" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    sparkles: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1.333l.907 2.053a1.333 1.333 0 001.04.747l2.26.193-1.7 1.487a1.333 1.333 0 00-.4 1.267l.52 2.18-1.787-1.174a1.333 1.333 0 00-1.466 0L6.42 9.26l.52-2.18a1.333 1.333 0 00-.4-1.267L4.833 4.333l2.26-.193a1.333 1.333 0 001.04-.747L8 1.333z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'shopping-bag': (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.667 14H3.333A1.334 1.334 0 012 12.667v-8a1.334 1.334 0 011.333-1.334h8A1.334 1.334 0 0112.667 4.667v8A1.334 1.334 0 0112.667 14zM5.333 4.667V3.333A2.667 2.667 0 018 .667a2.667 2.667 0 012.667 2.666V4.667" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'file-text': (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.333 1.333H4A1.333 1.333 0 002.667 2.667v10.666A1.333 1.333 0 004 14.667h8a1.333 1.333 0 001.333-1.333V5.333L9.333 1.333z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.333 1.333v4h4M5.333 8.667h5.334M5.333 11.333h5.334" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'trending-up': (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.333 12.667l3.334-4 2.666 2.667L10 6.667l4.667 5.333" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.667 6.667h3.333v3.333" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    settings: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.667 1.333v2M9.333 1.333v2M14 6.667h-2M4 6.667H2M12.667 12l-1.334-1.333M4.667 12l-1.334-1.333M12.667 4L11.333 2.667M4.667 4L3.333 2.667" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 9.333A1.333 1.333 0 108 6.667a1.333 1.333 0 000 2.666z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return <>{icons[icon] || null}</>;
};

const SidebarContent = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const coreItems = NAV_ITEMS.filter(i => i.group === 'core');
  const intelItems = NAV_ITEMS.filter(i => i.group === 'intelligence');
  const settingsItems = NAV_ITEMS.filter(i => i.group === 'settings');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '24px 12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* MERCHANT AI CORE Section */}
        <div style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
            MERCHANT AI CORE
          </span>
        </div>
        {coreItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 2,
                }}
              >
                <NavIcon icon={item.icon} isActive={active} />
                <span style={{
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}

        {/* INTELLIGENCE Section */}
        <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 24, paddingBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
            INTELLIGENCE
          </span>
        </div>
        {intelItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 2,
                }}
              >
                <NavIcon icon={item.icon} isActive={active} />
                <span style={{
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}

        {/* SETTINGS Section */}
        <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 24, paddingBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
            SETTINGS
          </span>
        </div>
        {settingsItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 2,
                }}
              >
                <NavIcon icon={item.icon} isActive={active} />
                <span style={{
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom: Razorpay Branding */}
      <div style={{
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        <svg width="120" height="28" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.362 7.542c-1.592-.876-3.474-1.332-5.42-1.332-4.418 0-8 3.25-8 7.258 0 4.01 3.582 7.26 8 7.26 1.947 0 3.828-.456 5.42-1.332l-1.1-2.684c-1.142.654-2.508 1.044-4.32 1.044-2.718 0-5.04-1.596-5.7-3.768h12.36c.084-.456.14-.936.14-1.44 0-4.008-3.582-7.258-8-7.258 0 0 0 0 0 0 .42 0 .84.036 1.242.096l-4.624 2.208zm-5.7-3.654c-2.718 0-5.04-1.596-5.7-3.768h-3.66v17.898h3.66V14.64c.66-2.172 2.982-3.768 5.7-3.768 2.718 0 5.04 1.596 5.7 3.768h3.66V7.542h-3.66c-.66 2.172-2.982 3.768-5.7 3.768z" fill="#fff"/>
          <text x="28" y="16" fill="white" fontFamily="Poppins" fontSize="11" fontWeight="500">Merchant AI Gateway</text>
        </svg>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          AI-powered commerce assistant
        </span>
      </div>
    </div>
  );
};

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Static sidebar on large screens */}
      <div
        style={{
          display: 'flex',
          width: 240,
          minWidth: 240,
          height: '100%',
          backgroundColor: '#213554',
          flexShrink: 0,
        }}
      >
        <SidebarContent />
      </div>

      {/* Overlay drawer on small screens */}
      <Drawer isOpen={isOpen} onDismiss={onClose} accessibilityLabel="Dashboard navigation">
        <DrawerHeader title="Navigation" subtitle="Merchant AI Gateway" />
        <DrawerBody>
          <SidebarContent />
        </DrawerBody>
      </Drawer>
    </>
  );
}
