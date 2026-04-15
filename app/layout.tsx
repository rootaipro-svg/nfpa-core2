'use client'
import React, { useState } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'تقارير الفحص', href: '/dashboard' },
    { name: 'سجل الصمامات', href: '/valves' },
    { name: '⚙️ اختبار المضخات', href: '/pump-test' },
    { name: '⚠️ سجل الأعطال', href: '/impairments' },
    { name: '📅 الجدولة الذكية', href: '/scheduler' },
    // الزر الجديد هنا
    { name: '💎 الاشتراك الماسي', href: '/subscribe', color: '#ffd700' }, 
  ];

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6' }}>
        
        {/* شريط علوي مطور */}
        <nav style={{ 
          backgroundColor: '#d32f2f', 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 20px', 
          color: 'white', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
        }}>
          <button onClick={toggleMenu} style={{ 
            background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', marginLeft: '15px' 
          }}>
            ☰
          </button>
          
          <h2 style={{ margin: 0, fontSize: '18px', flexGrow: 1 }}>نظام NFPA 25 الذكي</h2>
        </nav>

        {/* القائمة الجانبية المنبثقة */}
        {isOpen && (
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1001
          }} onClick={toggleMenu}>
            <div style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '250px', background: '#fff', padding: '20px', boxShadow: '-2px 0 10px rgba(0,0,0,0.2)'
            }} onClick={e => e.stopPropagation()}>
              <h3 style={{ color: '#d32f2f', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>القائمة الرئيسية</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {navLinks.map((link, idx) => (
                  <Link key={idx} href={link.href} onClick={toggleMenu} style={{ 
                    textDecoration: 'none', 
                    color: link.color ? link.color : '#333', 
                    fontWeight: 'bold', 
                    padding: '12px', 
                    borderRadius: '5px', 
                    background: link.color ? '#333' : '#f9f9f9',
                    textAlign: 'center'
                  }}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <main style={{ minHeight: 'calc(100vh - 60px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
