'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function ProfessionalDashboard() {
    const [inspections, setInspections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => {
        const fetchReports = async () => {
            // جلب البيانات مع ربط المنظومة والمبنى
            const { data } = await supabase
                .from('valve_inspections')
                .select('*, fire_valves(*, fire_systems(*))')
                .order('inspection_date', { ascending: false });
            if (data) setInspections(data);
            setLoading(false);
        };
        fetchReports();
    }, []);

    return (
        <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Arial' }}>
            <h2 style={{ borderBottom: '3px solid #d32f2f', paddingBottom: '10px' }}>سجل الامتثال السنوي (ITM Compliance Log)</h2>
            
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                    <thead>
                        <tr style={{ background: '#333', color: '#fff' }}>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>التاريخ</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>المبنى / المنظومة</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>رقم الصمام</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>الحالة الفنية</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>المفتش</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>التقرير</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inspections.map((report, idx) => (
                            <tr key={idx} style={{ textAlign: 'center' }}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(report.inspection_date).toLocaleDateString('ar-SA')}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {report.fire_valves?.fire_systems?.building_name} / {report.fire_valves?.fire_systems?.system_name}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{report.valve_number}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {report.is_fully_open && !report.has_leaks ? 
                                        <span style={{ color: 'green' }}>● مطابق للمواصفات</span> : 
                                        <span style={{ color: 'red' }}>● يوجد ملاحظات فنية</span>
                                    }
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{report.inspector_name}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    <Link href={`/report/${report.id}`} style={{ color: '#d32f2f', textDecoration: 'none', fontWeight: 'bold' }}>عرض الشهادة التفصيلية</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
