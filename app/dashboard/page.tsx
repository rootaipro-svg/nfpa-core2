'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function Dashboard() {
    const [inspections, setInspections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInspections();
    }, []);

    const fetchInspections = async () => {
        const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
        const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
        
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            // سحب البيانات مع دمج رقم الصمام من جدول fire_valves
            const { data, error } = await supabase
                .from('valve_inspections')
                .select(`
                    *,
                    fire_valves (
                        valve_number
                    )
                `)
                .order('inspection_date', { ascending: false });

            if (error) {
                console.error("Error fetching data:", error);
            } else if (data) {
                setInspections(data);
            }
        } catch (err) {
            console.error("Connection error");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', direction: 'rtl', maxWidth: '1000px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #d32f2f', paddingBottom: '10px', marginBottom: '20px' }}>
                <h2 style={{ color: '#d32f2f', margin: 0 }}>لوحة تحكم الإدارة - تقارير الفحص</h2>
                <Link href="/" style={{ padding: '10px 20px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>العودة للرئيسية</Link>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', fontSize: '18px' }}>جاري تحميل التقارير...</p>
            ) : inspections.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>لا توجد تقارير فحص مسجلة حتى الآن.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#d32f2f', color: 'white' }}>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>التاريخ</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>المفتش</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>رقم الصمام</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>مفتوح؟</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>مقفل/مراقب؟</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>تسريب؟</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>ملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inspections.map((insp, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px' }}>
                                        {new Date(insp.inspection_date).toLocaleString('ar-SA')}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                                        {insp.inspector_name}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', color: '#0066cc', fontWeight: 'bold', direction: 'ltr', textAlign: 'right' }}>
                                        {insp.fire_valves?.valve_number || 'غير معروف'}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {insp.is_fully_open ? <span style={{ color: 'green', fontWeight: 'bold' }}>✔ نعم</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>✖ لا</span>}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {insp.is_locked_or_supervised ? <span style={{ color: 'green' }}>✔ نعم</span> : <span style={{ color: 'red' }}>✖ لا</span>}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {insp.has_leaks ? <span style={{ color: 'red', fontWeight: 'bold' }}>⚠ يوجد</span> : <span style={{ color: 'green' }}>سليم</span>}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                        {insp.notes || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
