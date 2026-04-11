'use client'
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';

export default function AddValve() {
    const [valve, setValve] = useState({ number: '', type: 'OS&Y', location: '' });
    const [qrUrl, setQrUrl] = useState('');

    const handleGenerate = (e: any) => {
        e.preventDefault();
        // هذا رابط مبدئي سيتم تغييره لاحقاً عند ربط قاعدة البيانات
        const fakeId = valve.number || 'test';
        setQrUrl(`${window.location.origin}/inspect/${fakeId}`);
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', direction: 'rtl', maxWidth: '500px', margin: 'auto' }}>
            <h2 style={{ color: '#d32f2f' }}>إضافة صمام جديد (NFPA 25)</h2>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input required placeholder="رقم الصمام (مثلاً: V-101)" style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }} onChange={e => setValve({...valve, number: e.target.value})} />
                <select style={{ padding: '12px', borderRadius: '5px' }} onChange={e => setValve({...valve, type: e.target.value})}>
                    <option value="OS&Y">OS&Y (خارجي وبكرة)</option>
                    <option value="Butterfly">Butterfly (فراشة)</option>
                </select>
                <input placeholder="موقع الصمام" style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }} onChange={e => setValve({...valve, location: e.target.value})} />
                <button type="submit" style={{ padding: '15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                    حفظ وتوليد QR Code
                </button>
            </form>

            {qrUrl && (
                <div style={{ marginTop: '30px', textAlign: 'center', border: '2px dashed #d32f2f', padding: '20px', borderRadius: '10px' }}>
                    <h3 style={{ color: '#333' }}>كود الصمام: {valve.number}</h3>
                    <QRCodeCanvas value={qrUrl} size={180} />
                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>قم بطباعة هذا الكود ولصقه على الصمام</p>
                </div>
            )}
            
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <Link href="/" style={{ color: '#0066cc', textDecoration: 'none' }}>← العودة للرئيسية</Link>
            </div>
        </div>
    );
}
