'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function InspectValve() {
    const params = useParams();
    const valveId = params?.id;
    
    const [status, setStatus] = useState('مفتوح (طبيعي)');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInspect = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        // المفاتيح المباشرة لتجاوز أي تعقيدات
        const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
        const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
        
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            // نستخدم الجدول البسيط الذي رأيته في صورتك
            const { error } = await supabase
                .from('valve_inspections')
                .insert([{ 
                    valve_number: valveId, 
                    status: status, 
                    notes: notes 
                }]);

            if (error) {
                alert("حدث خطأ أثناء الإرسال، تأكد أنك ألغيت قفل RLS لهذا الجدول: " + error.message);
            } else {
                alert("تم إرسال تقرير الفحص بنجاح إلى الإدارة!");
            }
        } catch (err) {
            alert("خطأ في الاتصال بقاعدة البيانات");
        }
        
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', direction: 'rtl', maxWidth: '400px', margin: 'auto' }}>
            <h2 style={{ color: '#d32f2f', borderBottom: '2px solid #d32f2f', paddingBottom: '10px' }}>الفحص الميداني (NFPA 25)</h2>
            
            <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '16px' }}><strong>رقم الصمام الممسوح:</strong></p>
                <p style={{ margin: 0, color: '#0066cc', fontWeight: 'bold' }}>{valveId}</p>
            </div>

            <form onSubmit={handleInspect} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>حالة الصمام الآن:</label>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} onChange={e => setStatus(e.target.value)}>
                        <option value="مفتوح (طبيعي)">مفتوح (وضع طبيعي آمن)</option>
                        <option value="مغلق (خطر)">مغلق (حالة خطرة)</option>
                        <option value="تسريب">يوجد تسريب</option>
                        <option value="تالف">تالف أو مكسور</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>ملاحظات إضافية:</label>
                    <textarea placeholder="اكتب الملاحظات..." rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }} onChange={e => setNotes(e.target.value)} />
                </div>

                <button type="submit" disabled={loading} style={{ padding: '15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold' }}>
                    {loading ? 'جاري الإرسال...' : 'اعتماد التقرير'}
                </button>
            </form>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>العودة</Link>
            </div>
        </div>
    );
}
