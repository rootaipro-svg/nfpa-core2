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

    if (!report) return <p style={{ textAlign: 'center', padding: '50px' }}>جاري تحميل شهادة الامتثال...</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '40px', border: '1px solid #000', backgroundColor: '#fff', direction: 'rtl', fontFamily: 'serif' }}>
            
            {/* الترويسة الرسمية */}
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '4px double #000', paddingBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>تقرير فحص واختبار وصيانة (ITM)</h1>
                <h3 style={{ margin: '5px 0' }}>امتثالاً لمعايير NFPA 25</h3>
                <p>تاريخ الفحص: {new Date(report.inspection_date).toLocaleDateString('ar-SA')}</p>
            </div>

            {/* بيانات المنظومة */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <tr style={{ background: '#eee' }}><th colSpan={4} style={{ padding: '10px', border: '1px solid #000' }}>بيانات المنظومة والقطعة (Asset Info)</th></tr>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '10px' }}><strong>المبنى / الموقع:</strong></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{report.fire_valves?.fire_systems?.building_name}</td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}><strong>نوع المنظومة:</strong></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{report.fire_valves?.fire_systems?.system_name}</td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '10px' }}><strong>رقم الصمام:</strong></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{report.fire_valves?.valve_number}</td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}><strong>نوع الصمام:</strong></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{report.fire_valves?.valve_type}</td>
                </tr>
            </table>

            {/* بنود الفحص */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <tr style={{ background: '#eee' }}><th style={{ padding: '10px', border: '1px solid #000' }}>بنود فحص الصمامات (Inspection Checklist)</th><th style={{ padding: '10px', border: '1px solid #000', width: '100px' }}>الحالة</th></tr>
                <tr><td style={{ border: '1px solid #000', padding: '10px' }}>هل الصمام في وضع الفتح بالكامل ومؤمن؟</td><td style={{ border: '1px solid #000', textAlign: 'center' }}>{report.is_fully_open ? '✔ مطابق' : '✖ مخالف'}</td></tr>
                <tr><td style={{ border: '1px solid #000', padding: '10px' }}>هل الصمام خالي من أي تسريب مرئي (Visual Leakage)؟</td><td style={{ border: '1px solid #000', textAlign: 'center' }}>{!report.has_leaks ? '✔ سليم' : '✖ يوجد تسريب'}</td></tr>
                <tr><td style={{ border: '1px solid #000', padding: '10px' }}>هل التوصيلات واللوحات التعريفية واضحة وسليمة؟</td><td style={{ border: '1px solid #000', textAlign: 'center' }}>{report.has_identification !== false ? '✔ نعم' : '✖ لا'}</td></tr>
            </table>

            {/* ملاحظات المفتش */}
            <div style={{ marginBottom: '30px' }}>
                <p><strong>ملاحظات المفتش الميدانية:</strong></p>
                <div style={{ padding: '15px', border: '1px solid #ddd', minHeight: '60px', backgroundColor: '#f9f9f9' }}>
                    {report.notes || 'لم يتم تسجيل ملاحظات إضافية.'}
                </div>
            </div>

            {/* الصورة الميدانية المرفقة */}
            {report.photo_url && (
                <div style={{ marginTop: '20px', marginBottom: '30px', textAlign: 'center', pageBreakInside: 'avoid' }}>
                    <p style={{ fontWeight: 'bold', textAlign: 'right', marginBottom: '10px' }}>الدليل الميداني (Field Evidence Photo):</p>
                    <img 
                        src={report.photo_url} 
                        alt="Inspection Evidence" 
                        style={{ maxWidth: '100%', maxHeight: '400px', border: '2px solid #000', borderRadius: '5px' }} 
                    />
                </div>
            )}

            {/* الاعتماد والتوقيع */}
            <div style={{ marginTop: '50px', borderTop: '2px solid #000', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p>اسم المفتش المعتمد</p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{report.inspector_name}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p>التوقيع والختم الرسمي</p>
                        <div style={{ width: '180px', height: '80px', border: '1px dashed #ccc', marginTop: '10px' }}></div>
                    </div>
                </div>
            </div>
            
            {/* أزرار التحكم - تختفي تلقائياً عند الطباعة */}
            <div style={{ marginTop: '50px', textAlign: 'center' }} className="no-print">
                <button 
                    onClick={() => window.print()} 
                    style={{ padding: '15px 30px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                >
                    🖨️ تصدير التقرير إلى PDF
                </button>
                <style jsx global>{`
                    @media print {
                        .no-print { display: none !important; }
                        body { background-color: white !important; }
                        div { border: none !important; box-shadow: none !important; }
                    }
                `}</style>
            </div>
        </div>
    );
}
