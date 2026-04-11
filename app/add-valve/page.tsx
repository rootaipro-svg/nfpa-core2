'use client'
import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';

export default function AddValve() {
    const [systems, setSystems] = useState<any[]>([]);
    const [valve, setValve] = useState({ number: '', type: 'OS&Y', system_id: '', location: '' });
    const [qrUrl, setQrUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => {
        const fetchSystems = async () => {
            const { data } = await supabase.from('fire_systems').select('*');
            if (data) setSystems(data);
        };
        fetchSystems();
    }, []);

    const handleSave = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.from('fire_valves').insert([{ 
            valve_number: valve.number, 
            valve_type: valve.type, 
            system_id: valve.system_id,
            location_description: valve.location 
        }]).select();

        if (!error && data) {
            setQrUrl(`${window.location.origin}/inspect/${data[0].valve_number}`);
            alert("تم تسجيل الصمام وربطه بالمنظومة بنجاح!");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', direction: 'rtl' }}>
            <h2 style={{ color: '#d32f2f', borderBottom: '2px solid' }}>تأسيس أصل (Asset Registration)</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <label>رقم الصمام:</label>
                <input required placeholder="V-101" style={{ padding: '12px' }} onChange={e => setValve({...valve, number: e.target.value})} />
                
                <label>المنظومة التابع لها:</label>
                <select required style={{ padding: '12px' }} onChange={e => setValve({...valve, system_id: e.target.value})}>
                    <option value="">-- اختر المنظومة --</option>
                    {systems.map(sys => <option key={sys.id} value={sys.id}>{sys.system_name} ({sys.building_name})</option>)}
                </select>

                <label>نوع الصمام:</label>
                <select style={{ padding: '12px' }} onChange={e => setValve({...valve, type: e.target.value})}>
                    <option value="OS&Y">OS&Y Gate Valve</option>
                    <option value="Butterfly">Butterfly Valve</option>
                </select>

                <button type="submit" disabled={loading} style={{ padding: '15px', background: '#d32f2f', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    {loading ? 'جاري الحفظ...' : 'حفظ وتوليد QR'}
                </button>
            </form>

            {qrUrl && (
                <div style={{ marginTop: '30px', textAlign: 'center', padding: '20px', border: '2px dashed #333' }}>
                    <QRCodeCanvas value={qrUrl} size={150} />
                    <p>رابط الفحص الميداني جاهز</p>
                </div>
            )}
        </div>
    );
}
