'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ImpairmentsBoard() {
    const [impairments, setImpairments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ system: 'مضخات الحريق', type: 'عطل (Deficiency)', reporter: '', desc: '' });
    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    useEffect(() => { fetchImpairments(); }, []);
    const fetchImpairments = async () => {
        const { data } = await supabase.from('impairments').select('*').order('created_at', { ascending: false });
        if (data) setImpairments(data);
        setLoading(false);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await supabase.from('impairments').insert([{ system_name: formData.system, issue_type: formData.type, description: formData.desc, reported_by: formData.reporter }]);
        alert("تم التسجيل!");
        fetchImpairments();
    };

    return (
        <div style={{ padding: '15px', direction: 'rtl' }}>
            <h2 style={{ color: '#d32f2f', textAlign: 'center' }}>سجل الأعطال النشطة</h2>
            
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h4 style={{ marginTop: 0 }}>➕ تسجيل بلاغ جديد</h4>
                <select style={{ width: '100%', padding: '12px', marginBottom: '10px' }} onChange={e=>setFormData({...formData, system: e.target.value})}><option>مضخات الحريق</option><option>نظام الرشاشات</option></select>
                <select style={{ width: '100%', padding: '12px', marginBottom: '10px' }} onChange={e=>setFormData({...formData, type: e.target.value})}><option>عطل (Deficiency)</option><option>إعاقة (Impairment)</option></select>
                <input placeholder="اسم المفتش" style={{ width: '100%', padding: '12px', marginBottom: '10px' }} onChange={e=>setFormData({...formData, reporter: e.target.value})} />
                <textarea placeholder="وصف المشكلة" style={{ width: '100%', padding: '12px', marginBottom: '10px' }} onChange={e=>setFormData({...formData, desc: e.target.value})} />
                <button style={{ width: '100%', padding: '15px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>إرسال البلاغ</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {impairments.map((imp, idx) => (
                    <div key={idx} style={{ background: '#fff', padding: '15px', borderRadius: '8px', borderRight: `5px solid ${imp.issue_type.includes('إعاقة') ? 'red' : 'orange'}` }}>
                        <div style={{ fontWeight: 'bold' }}>{imp.system_name}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>{imp.description}</div>
                        <div style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>المبلغ: {imp.reported_by}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
