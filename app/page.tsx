'use client'
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', direction: 'rtl' }}>
      <div style={{ marginTop: '30px', marginBottom: '30px' }}>
        <h1 style={{ color: '#d32f2f', fontSize: '28px' }}>NFPA 25 الذكي</h1>
        <p style={{ color: '#666' }}>نظام إدارة وامتثال صمامات ومضخات الحريق</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: 'auto' }}>
         <Link href="/add-valve" style={{ textDecoration: 'none' }}>
           <button style={{ width: '100%', padding: '20px', fontSize: '18px', cursor: 'pointer', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(211,47,47,0.3)' }}>
             ➕ إضافة صمام جديد
           </button>
         </Link>

         <Link href="/dashboard" style={{ textDecoration: 'none' }}>
           <button style={{ width: '100%', padding: '20px', fontSize: '18px', cursor: 'pointer', background: '#fff', color: '#333', border: '2px solid #333', borderRadius: '12px', fontWeight: 'bold' }}>
             📋 تقارير الفحص الميداني
           </button>
         </Link>

         <Link href="/scheduler" style={{ textDecoration: 'none' }}>
           <button style={{ width: '100%', padding: '20px', fontSize: '18px', cursor: 'pointer', background: '#00bcd4', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
             📅 جدول الصيانة والامتثال
           </button>
         </Link>
      </div>
    </div>
  );
}
