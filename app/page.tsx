'use client'
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '50px', fontFamily: 'Arial', textAlign: 'center', direction: 'rtl', minHeight: '100vh', backgroundColor: '#fff' }}>
      <h1 style={{ color: '#d32f2f', fontSize: '32px' }}>نظام NFPA 25 الذكي</h1>
      <div style={{ background: '#f4f4f4', padding: '30px', borderRadius: '15px', display: 'inline-block', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>مرحباً بك يا أستاذ عمر</p>
        <p>النظام الآن جاهز ومربوط بقاعدة البيانات بنجاح.</p>
      </div>
      
      <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
         <Link href="/add-valve">
           <button style={{ padding: '15px 40px', fontSize: '18px', cursor: 'pointer', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
             إضافة صمام وتوليد QR
           </button>
         </Link>

         <Link href="/dashboard">
           <button style={{ padding: '15px 40px', fontSize: '18px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
             عرض لوحة تحكم التقارير
           </button>
         </Link>
      </div>
    </div>
  );
}
