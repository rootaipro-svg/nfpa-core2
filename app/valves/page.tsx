'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function ValvesRegistry() {
    const [valves, setValves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => { fetchValves(); }, []);
    const fetchValves = async () => {
        const { data } = await supabase.from('fire_valves').select('*').order('created_at', { ascending: false });
        if (data) setValves(data);
        setLoading(false);
    };

    return (
        <div style={{ padding: '15px', direction: 'rtl' }}>
            <h2 style={{ color: '#d32f2f', textAlign: 'center' }}>سجل الأصول (Valves)</h2>
            
            {loading ? <p style={{ textAlign: 'center' }}>جاري التحميل...</p> : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {valves.map((v, i) => (
                        <div key={i} style={{ background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRight: '5px solid #d32f2f' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '18px', color: '#0066cc' }}>{v.valve_number}</strong>
                                <span style={{ fontSize: '12px', color: '#999' }}>{new Date(v.created_at).toLocaleDateString('ar-SA')}</span>
                            </div>
                            <p style={{ margin: '10px 0' }}><strong>النوع:</strong> {v.valve_type}</p>
                            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>{v.location_description}</p>
                            <Link href={`/print/${v.valve_number}`} style={{ textDecoration: 'none' }}>
                                <button style={{ width: '100%', padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>عرض الباركود 🖨️</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
