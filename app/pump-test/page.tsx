'use client'
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function PumpTestRoom() {
    const [pumpName, setPumpName] = useState('مضخة الحريق الرئيسية P-01');
    const [loading, setLoading] = useState(false);
    
    // قراءات المصنع (Factory Curve)
    const [f0, setF0] = useState(100);
    const [f100, setF100] = useState(90);
    const [f150, setF150] = useState(65);

    // قراءات الاختبار الميداني (Field Test Curve)
    const [t0, setT0] = useState(95);
    const [t100, setT100] = useState(85);
    const [t150, setT150] = useState(60);

    // تقييم آلي لحالة المضخة (لا يجب أن يقل الاختبار عن 95% من المصنع)
    const isPass = t100 >= (f100 * 0.95) && t150 >= (f150 * 0.95);

    const handleSaveTest = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
        const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
        
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { error } = await supabase.from('pump_tests').insert([{ 
                pump_name: pumpName, 
                factory_0: f0, factory_100: f100, factory_150: f150,
                test_0: t0, test_100: t100, test_150: t150
            }]);

            if (error) throw error;
            alert("تم حفظ شهادة اختبار المضخة بنجاح!");
        } catch (err: any) {
            alert("خطأ في الحفظ: تأكد من جدول pump_tests " + err.message);
        }
        setLoading(false);
    };

    // حسابات الرسم البياني (SVG)
    const maxPressure = Math.max(f0, t0, 100) + 10;
    const calcY = (val: number) => 300 - ((val / maxPressure) * 250);

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', direction: 'rtl', maxWidth: '1200px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #d32f2f', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1 style={{ color: '#d32f2f', margin: 0 }}>غرفة اختبار مضخات الحريق (NFPA 25)</h1>
                <Link href="/" style={{ padding: '10px 20px', background: '#333', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>العودة للرئيسية</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                
                {/* لوحة إدخال القراءات */}
                <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3>إدخال البيانات الميدانية</h3>
                    <input value={pumpName} onChange={e => setPumpName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px' }} />
                    
                    <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ background: '#ddd' }}>
                                <th style={{ padding: '10px' }}>التدفق (Flow)</th>
                                <th style={{ padding: '10px', color: '#0066cc' }}>ضغط المصنع (PSI)</th>
                                <th style={{ padding: '10px', color: '#d32f2f' }}>الاختبار الحالي (PSI)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>0% (Churn)</td>
                                <td><input type="number" value={f0} onChange={e => setF0(Number(e.target.value))} style={{ width: '80px', padding: '5px' }}/></td>
                                <td><input type="number" value={t0} onChange={e => setT0(Number(e.target.value))} style={{ width: '80px', padding: '5px' }}/></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>100% (Rated)</td>
                                <td><input type="number" value={f100} onChange={e => setF100(Number(e.target.value))} style={{ width: '80px', padding: '5px' }}/></td>
                                <td><input type="number" value={t100} onChange={e => setT100(Number(e.target.value))} style={{ width: '80px', padding: '5px' }}/></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>150% (Overload)</td>
                                <td><input type="number" value={f150} onChange={e => setF150(Number(e.target.value))} style={{ width: '80px', padding: '5px' }}/></td>
                                <td><input type="number" value={t150} onChange={e => setT150(Number(e.target.value))} style={{ width: '80px', padding: '5px' }}/></td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ padding: '15px', background: isPass ? '#e8f5e9' : '#ffebee', borderRadius: '5px', textAlign: 'center', border: `2px solid ${isPass ? 'green' : 'red'}` }}>
                        <h2 style={{ margin: 0, color: isPass ? 'green' : 'red' }}>
                            النتيجة: {isPass ? 'نجاح (Pass) ✔' : 'فشل (Fail) ✖ - هبوط الأداء أكثر من 5%'}
                        </h2>
                    </div>

                    <button onClick={handleSaveTest} disabled={loading} style={{ width: '100%', padding: '15px', marginTop: '20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>
                        {loading ? 'جاري حفظ الشهادة...' : 'اعتماد تقرير المضخة'}
                    </button>
                </div>

                {/* شاشة العرض التفاعلية (الرسم البياني) */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ccc', position: 'relative' }}>
                    <h3 style={{ textAlign: 'center' }}>منحنى أداء المضخة (Pump Performance Curve)</h3>
                    
                    <svg width="100%" height="300" style={{ borderLeft: '2px solid #000', borderBottom: '2px solid #000', background: '#fafafa' }}>
                        {/* خطوط الشبكة */}
                        <line x1="0" y1={calcY(f100)} x2="500" y2={calcY(f100)} stroke="#eee" strokeWidth="1" />
                        
                        {/* منحنى المصنع (أزرق) */}
                        <polyline 
                            points={`0,${calcY(f0)} 250,${calcY(f100)} 375,${calcY(f150)}`} 
                            fill="none" stroke="#0066cc" strokeWidth="4" 
                        />
                        {/* منحنى الاختبار (أحمر) */}
                        <polyline 
                            points={`0,${calcY(t0)} 250,${calcY(t100)} 375,${calcY(t150)}`} 
                            fill="none" stroke="#d32f2f" strokeWidth="4" strokeDasharray="5,5" 
                        />
                        
                        {/* النقاط */}
                        <circle cx="0" cy={calcY(f0)} r="6" fill="#0066cc" />
                        <circle cx="250" cy={calcY(f100)} r="6" fill="#0066cc" />
                        <circle cx="375" cy={calcY(f150)} r="6" fill="#0066cc" />
                        
                        <circle cx="0" cy={calcY(t0)} r="6" fill="#d32f2f" />
                        <circle cx="250" cy={calcY(t100)} r="6" fill="#d32f2f" />
                        <circle cx="375" cy={calcY(t150)} r="6" fill="#d32f2f" />
                    </svg>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#666', fontWeight: 'bold' }}>
                        <span>0% (Churn)</span>
                        <span style={{ marginLeft: '-80px' }}>100% Flow</span>
                        <span>150% Flow</span>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '20px', height: '4px', background: '#0066cc' }}></div>
                            <span>منحنى المصنع</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '20px', height: '4px', background: '#d32f2f', borderTop: '2px dashed #fff' }}></div>
                            <span>الاختبار الحالي</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
