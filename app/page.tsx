'use client'
import React from 'react';
import Link from 'next/link';

export default function Home() {
  const menuItems = [
    { title: 'إضافة صمام جديد', icon: '➕', href: '/add-valve', color: '#d32f2f' },
    { title: 'تقارير الفحص', icon: '📋', href: '/dashboard', color: '#333' },
    { title: 'سجل الأصول', icon: '🛠️', href: '/valves', color: '#333' },
    { title: 'اختبار المضخات', icon: '⚙️', href: '/pump-test', color: '#fbc02d' },
    { title: 'سجل الإعاقات', icon: '⚠️', href: '/impairments', color: '#f57c00' },
    { title: 'الجدولة الذكية', icon: '📅', href: '/scheduler', color: '#00bcd4' },
    { title: 'إدارة الجهات', icon: '🏢', href: '/management', color: '#607d8b' },
  ];

  return (
    <div style={{ padding: '20px', direction: 'rtl', textAlign: 'center' }}>
      <h1 style={{ color: '#d32f2f', fontSize: '26px', marginBottom: '30px' }}>منصة NFPA 25 الاحترافية</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px', 
        maxWidth: '500px', 
        margin: 'auto' 
      }}>
        {menuItems.map((item, idx) => (
          <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: item.color, 
              color: 'white', 
              padding: '20px 10px', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 'bold'
            }}>
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px' }}>{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
