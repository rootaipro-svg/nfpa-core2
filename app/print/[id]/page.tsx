'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';

export default function PrintQR() {
    const params = useParams();
    const valveId = params?.id;
    const [qrUrl, setQrUrl] = useState('');

    useEffect(() => {
        // تجهيز الرابط الخاص بالفحص ليتم وضعه داخل الباركود
        const siteOrigin = window.location.origin;
        setQrUrl(`${siteOrigin}/inspect/${valveId}`);
    }, [valveId]);

    if (!qrUrl) return null;

    return (
        <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial', backgroundColor: '#fff', minHeight: '100vh' }}>
            
            {/* هذه المنطقة التي ستظهر في الطباعة */}
            <div style={{ border: '3px solid #000', padding: '30px', display: 'inline-block', borderRadius: '15px', backgroundColor: '#fff' }}>
                <h2 style={{ color: '#000', fontSize: '28px', margin: '0 0 20px 0', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                    صمام حريق / Fire Valve
                </h2>
                
                <QRCodeCanvas value={qrUrl} size={250} level={"H"} />
                
                <h1 style={{ marginTop: '20px', fontSize: '36px', letterSpacing: '2px', color: '#000' }}>
                    {valveId}
                </h1>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '18px' }}>مسح للفحص - Scan to Inspect</p>
            </div>

            {/* أزرار التحكم (لن تظهر في ورقة الطباعة بفضل تنسيق CSS المدمج لكن سنعتمد على زر المتصفح) */}
            <div style={{ marginTop: '40px' }}>
                <button onClick={() => window.print()} style={{ padding: '15px 30px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', marginLeft: '15px' }}>
                    🖨️ طباعة الملصق
                </button>
                
                <Link href="/valves">
                    <button style={{ padding: '15px 30px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
                        العودة للسجل
                    </button>
                </Link>
            </div>
            
        </div>
    );
}
