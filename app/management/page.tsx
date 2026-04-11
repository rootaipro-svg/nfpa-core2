'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function MultiManagement() {
    const [entities, setEntities] = useState<any[]>([]);
    const [newEntity, setNewEntity] = useState({ name: '', logo: '' });
    const [newSite, setNewSite] = useState({ entityId: '', name: '', lat: '', lng: '' });
    
    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => { fetchEntities(); }, []);

    const fetchEntities = async () => {
        const { data } = await supabase.from('entities').select('*, sites(*)');
        if (data) setEntities(data);
    };

    const addEntity = async () => {
        if (!newEntity.name) return;
        await supabase.from('entities').insert([{ name: newEntity.name, logo_url: newEntity.logo }]);
        setNewEntity({ name: '', logo: '' });
        fetchEntities();
    };

    const addSite = async (eId: string) => {
        if (!newSite.name) return;
        await supabase.from('sites').insert([{ 
            entity_id: eId, site_name: newSite.name, 
            latitude: parseFloat(newSite.lat), longitude: parseFloat(newSite.lng) 
        }]);
        setNewSite({ entityId: '', name: '', lat: '', lng: '' });
        fetchEntities();
    };

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            <h2 style={{ color: '#d32f2f', textAlign: 'center' }}>إدارة العملاء والمواقع الجغرافية</h2>
            
            {/* إضافة جهة/عميل جديد */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h4 style={{ marginTop: 0 }}>🏢 إضافة عميل جديد</h4>
                <input style={{ width: '100%', padding: '12px', marginBottom: '10px' }} placeholder="اسم العميل (مثلاً: شركة أرامكو)" value={newEntity.name} onChange={e=>setNewEntity({...newEntity, name: e.target.value})} />
                <input style={{ width: '100%', padding: '12px', marginBottom: '15px' }} placeholder="رابط شعار العميل (URL)" value={newEntity.logo} onChange={e=>setNewEntity({...newEntity, logo: e.target.value})} />
                <button onClick={addEntity} style={{ width: '100%', padding: '12px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>حفظ العميل</button>
            </div>

            {/* عرض الجهات والمواقع */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {entities.map((ent, i) => (
                    <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '12px', borderRight: '8px solid #d32f2f', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            {ent.logo_url && <img src={ent.logo_url} style={{ height: '50px', width: '50px', objectFit: 'contain', border: '1px solid #eee', padding: '2px' }} />}
                            <h3 style={{ margin: 0 }}>{ent.name}</h3>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>📍 المواقع التابعة لها:</h5>
                            {ent.sites?.map((s: any, idx: number) => (
                                <div key={idx} style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{s.site_name}</span>
                                    {s.latitude && (
                                        <a href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}`} target="_blank" style={{ color: '#d32f2f', textDecoration: 'none', fontWeight: 'bold' }}>📍 فتح الخريطة</a>
                                    )}
                                </div>
                            ))}
                            
                            {/* إضافة موقع للموقع الحالي */}
                            <div style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                                <input placeholder="اسم الموقع الجديد" style={{ width: '100%', padding: '8px', marginBottom: '5px' }} onBlur={e => setNewSite({...newSite, name: e.target.value})} />
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <input placeholder="خط العرض (Lat)" style={{ flex: 1, padding: '8px' }} onBlur={e => setNewSite({...newSite, lat: e.target.value})} />
                                    <input placeholder="خط الطول (Lng)" style={{ flex: 1, padding: '8px' }} onBlur={e => setNewSite({...newSite, lng: e.target.value})} />
                                </div>
                                <button onClick={() => addSite(ent.id)} style={{ width: '100%', marginTop: '5px', padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>إضافة الموقع</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
