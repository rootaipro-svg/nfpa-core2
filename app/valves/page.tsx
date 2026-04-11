'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function ValvesRegistry() {
    const [valves, setValves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchValves();
    }, []);

    const fetchValves = async () => {
        const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
        const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
        
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            const { data, error } = await supabase
                .from('fire_valves')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching valves:", error);
            } else if (data) {
                setValves(data);
            }
        } catch (err) {
            console.error("Connection error");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #d32f2f', paddingBottom: '10px', marginBottom: '20px' }}>
                <h2 style={{ color: '#d32f2f', margin: 0 }}>سجل الأصول - صمامات الحريق</h2>
                <Link href="/add-valve" style={{ padding: '10px 20px', background: '#d32f2f', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>+ إضافة صمام جديد</Link>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', fontSize: '18px' }}>جاري تحميل سجل الصمامات...</p>
            ) : valves.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>لا توجد صمامات مسجلة في النظام.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#333', color: 'white' }}>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>رقم الصمام</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>النوع</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>الموقع / الوصف</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd' }}>تاريخ الإضافة</th>
                                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>الباركود</th>
                            </tr>
                        </thead>
                        <tbody>
                            {valves.map((valve, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold', color: '#0066cc', direction: 'ltr', textAlign: 'right' }}>
                                        {valve.valve_number}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{valve.valve_type}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{valve.location_description || '-'}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px' }}>
                                        {new Date(valve.created_at).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        <Link href={`/print/${valve.valve_number}`}>
                                            <button style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                                عرض / طباعة
                                            </button>
                                        </Link>
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
