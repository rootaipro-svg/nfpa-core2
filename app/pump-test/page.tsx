'use client'
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function PumpTestRoom() {
    // ... (نفس الإعدادات السابقة) ...
    const [pumpName, setPumpName] = useState('مضخة الحريق P-01');
    const [loading, setLoading] = useState(false);
    const [f0, setF0] = useState(100); const [f100, setF100] = useState(90); const [f150, setF150] = useState(65);
    const [t0, setT0] = useState(95); const [t100, setT100] = useState(85); const [t150, setT150] = useState(60);
    const isPass = t100 >= (f100 * 0.95) && t150 >= (f150 * 0.95);

    const handleSaveTest = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');
        const { error } = await supabase.from('pump_tests').insert([{ pump_name: pumpName, factory_0: f0, factory_100: f100, factory_150: f150, test_0: t0, test_100: t100, test_150: t150 }]);
        if (!error) alert("تم الحفظ!");
        setLoading(false);
    };

    const maxPressure = Math.max(f0, t0, 100) + 10;
    const calcY = (val: number) => 300 - ((val / maxPressure) * 250);

    return (
        <div style={{ padding: '15px', direction: 'rtl' }}>
            <h2 style={{ color: '#d32f2f', textAlign: 'center' }}>اختبار مضخات الحريق</h2>

            {/* استخدام Flex-wrap لجعل العناصر تترتب تحت بعضها في الجوال */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* الرسم البياني أولاً في الجوال ليكون واضحاً */}
                <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}>
                    <h4 style={{ textAlign: 'center', margin: '10px 0' }}>منحنى الأداء</h4>
                    <svg width="100%" height="200" viewBox="0 0 500 300" preserveAspectRatio="none" style={{ background: '#fafafa' }}>
                        <polyline points={`0,${calcY(f0)} 250,${calcY(f100)} 375,${calcY(f150)}`} fill="none" stroke="#0066cc" strokeWidth="6" />
                        <polyline points={`0,${calcY(t0)} 250,${calcY(t100)} 375,${calcY(t150)}`} fill="none" stroke="#d32f2f" strokeWidth="6" strokeDasharray="10,10" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '12px', marginTop: '5px' }}>
                        <span>0%</span><span>100%</span><span>150%</span>
                    </div>
                </div>

                {/* جدول الإدخال */}
                <div style={{ background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '15px', padding: '10px', background: isPass ? '#e8f5e9' : '#ffebee', borderRadius: '5px', textAlign: 'center' }}>
                        <strong style={{ color: isPass ? 'green' : 'red' }}>النتيجة: {isPass ? 'ناجح' : 'فشل'}</strong>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '14px' }}>
                            <tr style={{ background: '#eee' }}><th>التدفق</th><th>المصنع</th><th>الاختبار</th></tr>
                            <tr><td>0%</td><td><input type="number" value={f0} onChange={e=>setF0(Number(e.target.value))} style={{width:'50px'}}/></td><td><input type="number" value={t0} onChange={e=>setT0(Number(e.target.value))} style={{width:'50px'}}/></td></tr>
                            <tr><td>100%</td><td><input type="number" value={f100} onChange={e=>setF100(Number(e.target.value))} style={{width:'50px'}}/></td><td><input type="number" value={t100} onChange={e=>setT100(Number(e.target.value))} style={{width:'50px'}}/></td></tr>
                            <tr><td>150%</td><td><input type="number" value={f150} onChange={e=>setF150(Number(e.target.value))} style={{width:'50px'}}/></td><td><input type="number" value={t150} onChange={e=>setT150(Number(e.target.value))} style={{width:'50px'}}/></td></tr>
                        </table>
                    </div>

                    <button onClick={handleSaveTest} style={{ width: '100%', padding: '15px', marginTop: '20px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                        اعتماد التقرير
                    </button>
                </div>

            </div>
        </div>
    );
}
