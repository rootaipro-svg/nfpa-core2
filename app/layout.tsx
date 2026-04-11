'use client'
import React, { useState } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // هنا تضع رابط شعار شركتك (شركة الفحص)
  const YOUR_COMPANY_LOGO = "https://ai4hse.com/wp-content/uploads/2024/01/logo.png"; 

  const navLinks = [
    { name: '🏠 الرئيسية', href: '/' },
    { name: '🏢 إدارة الجهات', href: '/management' },
    { name: '🛠️ سجل الصمامات', href: '/valves' },
    { name: '📅 الجدولة الذكية', href: '/scheduler' },
    { name: '📋 تقارير الفحص', href: '/dashboard' },
  ];

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6' }}>
        
        <nav style={{ backgroundColor: '#d32f2f', height: '70px', display: 'flex', alignItems: 'center', padding: '0 20px', color: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer', marginLeft: '15px' }}>☰</button>
          
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* شعار شركة الفحص المالكة للنظام */}
            <img src={YOUR_COMPANY_LOGO} alt="RootAIPro Logo" style={{ height: '40px', borderRadius: '5px', background: 'white', padding: '2px' }} />
            <h2 style={{ margin: 0, fontSize: '18px' }}>RootAIPro - NFPA 25</h2>
          </div>
        </nav>

        {isOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1001 }} onClick={() => setIsOpen(false)}>
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '260px', background: '#fff', padding: '25px', boxShadow: '-5px 0 15px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
                <h3 style={{ color: '#d32f2f', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>القائمة الرئيسية</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    {navLinks.map((link, idx) => (
                      <Link key={idx} href={link.href} onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', padding: '12px', borderRadius: '8px', background: '#f5f5f5' }}>{link.name}</Link>
                    ))}
                </div>
            </div>
          </div>
        )}

        <main>{children}</main>
      </body>
    </html>
  );
}
