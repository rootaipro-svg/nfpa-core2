'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function SystemsManagement() {
    const [entities, setEntities] = useState<any[]>([]);
    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => {
        const fetchData = async () => {
            // جلب الجهات مع مواقعها ومنظوماتها في استعلام واحد عميق
            const { data } = await supabase.from('entities').select('*, sites(*, fire_systems(*))');
            if (data) setEntities(data);
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '15px', direction: 'rtl' }}>
            <h2 style={{ color: '#d32f2f', borderBottom: '2px solid #d32f2f', paddingBottom: '10px' }}>جرد المنظومات حسب المواقع</h2>
            
            {entities.map((ent, i) => (
                <div key={i} style={{ marginBottom: '25px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    {/* شعار الشركة واسمها */}
                    <div style={{ background: '#333', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {ent.logo_url && <img src={ent.logo_url} style={{ height: '40px', background: '#fff', borderRadius: '4px' }} />}
                        <h3 style={{ margin: 0 }}>{ent.name}</h3>
                    </div>

                    {ent.sites?.map((site: any, idx: number) => (
                        <div key={idx} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                            <div style={{ fontWeight: 'bold', color: '#d32f2f', marginBottom: '10px' }}>📍 موقع: {site.site_name}</div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                                {site.fire_systems?.map((sys: any, sIdx: number) => (
                                    <div key={sIdx} style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', borderRight: '4px solid #00bcd4' }}>
                                        <div style={{ fontWeight: 'bold' }}>🛡️ منظومة: {sys.system_type}</div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>الموقع الدقيق: {sys.location_details}</div>
                                    </div>
                                ))}
                                {(!site.fire_systems || site.fire_systems.length === 0) && (
                                    <p style={{ fontSize: '12px', color: '#999' }}>لا توجد منظومات مسجلة لهذا الموقع بعد.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
