'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Dashboard() {
    const [inspections, setInspections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => { fetchInspections(); }, []);
    const fetchInspections = async () => {
        const { data } = await supabase.from('valve_inspections').select('*, fire_valves(valve_number)').order('inspection_date', { ascending: false });
        if (data) setInspections(data);
        setLoading(false);
    };

    return (
        <div style={{ padding: '15px', direction: 'rtl' }}>
            <h2 style={{ color: '#d32f2f', textAlign: 'center' }}>تقارير الفحص الميداني</h2>
            {loading ? <p style={{ textAlign: 'center' }}>جاري التحميل...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {inspections.map((insp, i) => (
                        <div key={i} style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '10px' }}>
                                <strong>{insp.fire_valves?.valve_number || 'صمام غير معروف'}</strong>
                                <span style={{ fontSize: '12px', color: '#666' }}>{new Date(insp.inspection_date).toLocaleDateString('ar-SA')}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                                <div>مفتوح: {insp.is_fully_open ? '✅' : '❌'}</div>
                                <div>تسريب: {insp.has_leaks ? '⚠️' : '✅'}</div>
                                <div style={{ gridColumn: 'span 2' }}>المفتش: <strong>{insp.inspector_name}</strong></div>
                            </div>
                            {insp.notes && <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '5px', fontSize: '13px' }}>{insp.notes}</div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
