'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function NFPA25ComprehensiveInspector() {
    const params = useParams();
    const valveId = params?.id;
    const [loading, setLoading] = useState(false);
    const [showHelp, setShowHelp] = useState<string | null>(null);

    // الحالة الكاملة لمتطلبات NFPA 25 (Chapter 13)
    const [formData, setFormData] = useState({
        inspector: '',
        isOpen: true,           // NFPA 25 13.3.2.1
        isLocked: true,         // NFPA 25 13.3.2.1.1
        noLeaks: true,          // NFPA 25 13.3.2.1.3
        hasTag: true,           // NFPA 25 13.3.2.1.8
        isAccessible: true,     // NFPA 25 13.3.2.1.2
        signageOk: true,        // NFPA 25 13.3.2.1.5
        noDamage: true,         // الحالة العامة للهيكل والطلاء
        notes: ''
    });

    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    const handleSave = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { data: v } = await supabase.from('fire_valves').select('id').eq('valve_number', valveId).single();
            
            if (!v) throw new Error("الصمام غير مسجل في النظام");

            const { error } = await supabase.from('valve_inspections').insert([{
                valve_id: v.id,
                inspector_name: formData.inspector,
                inspection_date: new Date().toISOString(),
                is_fully_open: formData.isOpen,
                is_locked_or_supervised: formData.isLocked,
                has_leaks: !formData.noLeaks,
                has_identification: formData.hasTag,
                is_accessible: formData.isAccessible,
                signage_ok: formData.signageOk,
                notes: formData.notes
            }]);

            if (error) throw error;
            alert("✅ تم إرسال تقرير الامتثال بنجاح");
        } catch (err: any) {
            alert("❌ خطأ: " + err.message);
        }
        setLoading(false);
    };

    // مكوّن السؤال الذكي
    const CheckItem = ({ id, label, value, setter, tip }: any) => (
        <div style={{ background: '#fff', padding: '15px', borderRadius: '15px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{label}</span>
                <button type="button" onClick={() => setShowHelp(showHelp === id ? null : id)} style={{ background: '#eee', border: 'none', borderRadius: '50%', width: '28px', height: '28px' }}>ℹ️</button>
            </div>
            {showHelp === id && <p style={{ fontSize: '12px', color: '#d32f2f', background: '#fff9c4', padding: '10px', borderRadius: '8px' }}>{tip}</p>}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setter(true)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: value ? '#2e7d32' : '#f5f5f5', color: value ? '#fff' : '#666', fontWeight: 'bold' }}>مطابق</button>
                <button type="button" onClick={() => setter(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: !value ? '#c62828' : '#f5f5f5', color: !value ? '#fff' : '#666', fontWeight: 'bold' }}>غير مطابق</button>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '15px', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={{ background: '#d32f2f', color: 'white', padding: '20px', borderRadius: '20px', marginBottom: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: 0 }}>تفتيش صمام NFPA 25 المعتمد</h3>
                <div style={{ marginTop: '5px', opacity: 0.8 }}>Asset ID: {valveId}</div>
            </div>

            <form onSubmit={handleSave}>
                <div style={{ background: '#fff', padding: '15px', borderRadius: '15px', marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>اسم المفتش المسؤول:</label>
                    <input required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={e => setFormData({ ...formData, inspector: e.target.value })} />
                </div>

                <CheckItem id="isOpen" label="1. هل الصمام في الوضع الصحيح (مفتوح)؟" value={formData.isOpen} setter={(v:any) => setFormData({...formData, isOpen: v})} tip="يجب التأكد من أن الصمام مفتوح بالكامل لضمان مرور المياه وقت الطوارئ." />
                
                <CheckItem id="isLocked" label="2. هل الصمام مؤمن (قفل/سلسلة)؟" value={formData.isLocked} setter={(v:any) => setFormData({...formData, isLocked: v})} tip="يتطلب المعيار قفل الصمام لمنع العبث أو الإغلاق العرضي." />

                <CheckItem id="isAccessible" label="3. هل الوصول للصمام سهل وغير معاق؟" value={formData.isAccessible} setter={(v:any) => setFormData({...formData, isAccessible: v})} tip="يجب أن يكون الصمام متاحاً للمكافحة في أي وقت بدون عوائق." />

                <CheckItem id="noLeaks" label="4. هل الصمام خالٍ من التسريب الخارجي؟" value={formData.noLeaks} setter={(v:any) => setFormData({...formData, noLeaks: v})} tip="أي تسريب قد يضعف ضغط المنظومة ويؤثر على الأداء." />

                <CheckItem id="hasTag" label="5. هل توجد لوحة تعريفية واضحة (Tag)؟" value={formData.hasTag} setter={(v:any) => setFormData({...formData, hasTag: v})} tip="يجب توضيح نوع المنظومة والمنطقة التي يتحكم بها الصمام." />

                <CheckItem id="signage" label="6. هل اللوحات الإرشادية موجودة وسليمة؟" value={formData.signageOk} setter={(v:any) => setFormData({...formData, signageOk: v})} tip="اللوحات التي ترشد لموقع الصمام في الحالات الطارئة." />

                <div style={{ background: '#fff', padding: '15px', borderRadius: '15px', marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>ملاحظات الحالة الفيزيائية (الصدأ/الطلاء):</label>
                    <textarea rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px' }} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '20px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', marginBottom: '40px' }}>
                    {loading ? 'جاري الاعتماد...' : 'حفظ تقرير الامتثال النهائي'}
                </button>
            </form>
        </div>
    );
}
