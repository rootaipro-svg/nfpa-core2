'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function MultiManagement() {
    const [entities, setEntities] = useState<any[]>([]);
    const [name, setName] = useState('');
    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => { fetchEntities(); }, []);

    const fetchEntities = async () => {
        const { data } = await supabase.from('entities').select('*, sites(*)');
        if (data) setEntities(data);
    };

    const addEntity = async () => {
        if (!name) return;
        await supabase.from('entities').insert([{ name }]);
        setName('');
        fetchEntities();
    };

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            <h2 style={{ color: '#d32f2f' }}>إدارة الجهات والمواقع</h2>
            
            <div style={{ background: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <h4>➕ إضافة جهة جديدة (شركة/جهة)</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input style={{ flex: 1, padding: '10px' }} placeholder="اسم الشركة" value={name} onChange={e=>setName(e.target.value)} />
                    <button onClick={addEntity} style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>حفظ</button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                {entities.map((ent, i) => (
                    <div key={i} style={{ background: '#fff', padding: '15px', borderRadius: '10px', borderRight: '5px solid #d32f2f' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{ent.name}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>عدد المواقع المسجلة: {ent.sites?.length || 0}</div>
                        <button style={{ marginTop: '10px', background: 'none', border: '1px solid #d32f2f', color: '#d32f2f', padding: '5px 10px', borderRadius: '5px' }}>+ إضافة موقع لهذه الجهة</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
