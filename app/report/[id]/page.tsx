'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function FormalReport() {
    const params = useParams();
    const [report, setReport] = useState<any>(null);
    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => {
        const fetchReport = async () => {
            const { data } = await supabase
                .from('valve_inspections')
                .select('*, fire_valves(*, fire_systems(*))')
                .eq('id', params.id)
                .single();
            if (data) setReport(data);
        };
        fetchReport();
    }, [params.id]);

    if (!report) return <p>جاري تحميل الشهادة...</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '40px', border: '1px solid #000', backgroundColor: '#fff', direction: 'rtl', fontFamily: 'serif' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '4px double #000', paddingBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>تقرير فحص واختبار وصيانة (ITM)</h1>
                <h3 style={{ margin: '5px 0' }}>حسب معايير NFPA 25</h3>
                <p>تاريخ الفحص: {new Date(report.inspection_date).toLocaleDateString('ar-SA')}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <tr style={{ background: '#eee' }}><th colSpan={4} style={{ padding: '10px', border: '1px solid #000' }}>بيانات المنظومة والقطعة (Asset Info)</th></tr>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '10px' }}><strong>اسم المنظومة:</strong></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{report.fire_valves?.fire_systems?.system_name}</td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}><strong>نوع المنظومة:</strong></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{report.fire_valves?.fire_systems?.system_type}</td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '10px' }}><strong>رقم الصمام:</strong></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{report.fire_valves?.valve_number}</td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}><strong>نوع الصمام:</strong></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{report.fire_valves?.valve_type}</td>
                </tr>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tr style={{ background: '#eee' }}><th style={{ padding: '10px', border: '1px solid #000' }}>بنود الفحص (Checklist Items)</th><th style={{ padding: '10px', border: '1px solid #000' }}>الحالة</th></tr>
                <tr><td style={{ border: '1px solid #000', padding: '10px' }}>هل الصمام في وضع الفتح بالكامل (Fully Open)؟</td><td style={{ border: '1px solid #000', textAlign: 'center' }}>{report.is_fully_open ? '✔ نعم' : '✖ لا'}</td></tr>
                <tr><td style={{ border: '1px solid #000', padding: '10px' }}>هل الصمام مؤمن بسلسلة وقفل أو مراقبة إلكترونية؟</td><td style={{ border: '1px solid #000', textAlign: 'center' }}>{report.is_locked_or_supervised ? '✔ نعم' : '✖ لا'}</td></tr>
                <tr><td style={{ border: '1px solid #000', padding: '10px' }}>هل الصمام خالي من التسريبات الخارجية؟</td><td style={{ border: '1px solid #000', textAlign: 'center' }}>{!report.has_leaks ? '✔ نعم' : '✖ يوجد تسريب'}</td></tr>
                <tr><td style={{ border: '1px solid #000', padding: '10px' }}>هل توجد لوحة تعريفية واضحة للصمام؟</td><td style={{ border: '1px solid #000', textAlign: 'center' }}>{report.has_identification ? '✔ نعم' : '✖ لا'}</td></tr>
            </table>

            <div style={{ marginTop: '30px' }}>
                <p><strong>ملاحظات المفتش:</strong> {report.notes || 'لا يوجد'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p>اسم المفتش</p>
                        <p><strong>{report.inspector_name}</strong></p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p>التوقيع / الختم</p>
                        <div style={{ width: '150px', height: '60px', borderBottom: '1px solid #000' }}></div>
                    </div>
                </div>
            </div>
            
            <button onClick={() => window.print()} style={{ marginTop: '40px', padding: '10px 20px', background: '#333', color: '#fff', cursor: 'pointer' }}>
                طباعة الشهادة الرسمية PDF
            </button>
        </div>
    );
}
