'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function SmartInspector() {
    const params = useParams();
    const valveId = params?.id;
    const [showHelp, setShowHelp] = useState(false);
    const [loading, setLoading] = useState(false);

    // الأسئلة الاحترافية حسب NFPA 25
    const [formData, setFormData] = useState({
        inspector: '',
        isOpen: true,
        isLocked: true,
        noLeaks: true,
        hasTag: true
    });

    const nfpaTips = {
        isOpen: "حسب NFPA 25 (13.3.2.1): يجب أن تكون الصمامات في الوضع المفتوح بالكامل لضمان تدفق المياه عند الحريق.",
        isLocked: "المعيار يطلب تأمين الصمام بسلسلة وقفل أو نظام مراقبة إلكتروني لمنع الإغلاق العبثي.",
        noLeaks: "يجب فحص الصمام بحثاً عن أي تسريب قد يقلل من ضغط الشبكة."
    };

    const handleSave = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');
        
        // جلب معرف الصمام الأصلي
        const { data: v } = await supabase.from('fire_valves').select('id').eq('valve_number', valveId).single();
        
        if (v) {
            await supabase.from('valve_inspections').insert([{
                valve_id: v.id,
                inspector_name: formData.inspector,
                is_fully_open: formData.isOpen,
                is_locked_or_supervised: formData.isLocked,
                has_leaks: !formData.noLeaks,
                has_identification: formData.hasTag
            }]);
            alert("تم اعتماد الفحص الفني بنجاح!");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '15px', direction: 'rtl', backgroundColor: '#fdfdfd' }}>
            <div style={{ background: '#d32f2f', color: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>مساعد الفحص الذكي (NFPA 25)</h3>
                <small>رقم الأصل: {valveId}</small>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input required placeholder="اسم الفني" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ccc' }} onChange={e=>setFormData({...formData, inspector: e.target.value})} />

                {/* سؤال مع مساعد ذكي */}
                <div style={{ background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong>هل الصمام مفتوح بالكامل؟</strong>
                        <button type="button" onClick={()=>setShowHelp(!showHelp)} style={{ background: '#333', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px' }}>؟</button>
                    </div>
                    {showHelp && <p style={{ fontSize: '12px', color: '#d32f2f', background: '#fff9c4', padding: '10px', borderRadius: '5px' }}>{nfpaTips.isOpen}</p>}
                    <select style={{ width: '100%', padding: '10px' }} onChange={e=>setFormData({...formData, isOpen: e.target.value==='true'})}>
                        <option value="true">نعم (مطابق)</option>
                        <option value="false">لا (غير مطابق)</option>
                    </select>
                </div>

                {/* باقي الأسئلة تتبع نفس النمط */}
                <div style={{ background: '#fff', padding: '15px', borderRadius: '10px' }}>
                    <strong>هل الصمام مؤمن بقفل؟</strong>
                    <select style={{ width: '100%', padding: '10px', marginTop: '10px' }} onChange={e=>setFormData({...formData, isLocked: e.target.value==='true'})}>
                        <option value="true">نعم</option>
                        <option value="false">لا</option>
                    </select>
                </div>

                <button type="submit" disabled={loading} style={{ padding: '18px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px' }}>
                    {loading ? 'جاري الحفظ...' : 'إرسال التقرير الميداني'}
                </button>
            </form>
        </div>
    );
}
