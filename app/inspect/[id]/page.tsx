'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function SmartInspector() {
    const params = useParams();
    const valveId = params?.id;
    const [showHelp, setShowHelp] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    // تحديث الوقت المباشر ليظهر للمفتش
    useEffect(() => {
        setCurrentTime(new Date().toLocaleString('ar-SA'));
    }, []);

    // الأسئلة الاحترافية الكاملة حسب NFPA 25 للفحص البصري
    const [formData, setFormData] = useState({
        inspector: '',
        isOpen: true,
        isLocked: true,
        noLeaks: true,
        hasTag: true,
        noDamage: true,
        notes: ''
    });

    const nfpaTips: { [key: string]: string } = {
        isOpen: "حسب NFPA 25 (13.3.2.1): يجب التأكد من أن الصمام في الوضع المفتوح بالكامل لضمان تدفق المياه.",
        isLocked: "يتطلب المعيار تأمين الصمام بسلسلة وقفل أو نظام مراقبة إلكتروني لمنع الإغلاق غير المصرح به.",
        noLeaks: "الفحص البصري للتأكد من عدم وجود تسريبات خارجية تؤثر على ضغط الشبكة.",
        hasTag: "يجب وجود لوحة تعريفية توضح رقم الصمام والمنطقة التي يتحكم بها."
    };

    const handleSave = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');
        
        try {
            // 1. جلب معرف الصمام (UUID) من جدول الأصول
            const { data: v, error: vError } = await supabase
                .from('fire_valves')
                .select('id')
                .eq('valve_number', valveId)
                .single();
            
            if (vError || !v) {
                alert("خطأ: لم يتم العثور على هذا الصمام في سجل الأصول.");
                setLoading(false);
                return;
            }

            // 2. إرسال البيانات مع التوقيت اللحظي الدقيق (تاريخ الفحص)
            const { error: iError } = await supabase.from('valve_inspections').insert([{
                valve_id: v.id,
                inspector_name: formData.inspector,
                inspection_date: new Date().toISOString(), // هنا يتم تسجيل "تاريخ التفتيش" بدقة الثانية
                is_fully_open: formData.isOpen,
                is_locked_or_supervised: formData.isLocked,
                has_leaks: !formData.noLeaks,
                has_identification: formData.hasTag,
                notes: formData.notes
            }]);

            if (iError) throw iError;

            alert("تم اعتماد الفحص الفني وحفظ التاريخ: " + new Date().toLocaleString('ar-SA'));
            
        } catch (err: any) {
            alert("فشل الحفظ: " + err.message);
        }
        setLoading(false);
    };

    const renderQuestion = (id: string, label: string, value: boolean, setter: (v: boolean) => void) => (
        <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '15px' }}>{label}</strong>
                <button type="button" onClick={() => setShowHelp(showHelp === id ? null : id)} style={{ background: '#333', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', fontSize: '14px' }}>؟</button>
            </div>
            {showHelp === id && <p style={{ fontSize: '12px', color: '#d32f2f', background: '#fff9c4', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>{nfpaTips[id]}</p>}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setter(true)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: value ? '#4caf50' : '#eee', color: value ? 'white' : '#666', fontWeight: 'bold' }}>مطابق ✅</button>
                <button type="button" onClick={() => setter(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: !value ? '#f44336' : '#eee', color: !value ? 'white' : '#666', fontWeight: 'bold' }}>خلل ❌</button>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '15px', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            {/* الهيدر الاحترافي */}
            <div style={{ background: '#d32f2f', color: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(211,47,47,0.2)' }}>
                <h3 style={{ margin: 0, fontSize: '20px' }}>مساعد الفحص الميداني</h3>
                <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.9 }}>
                    <div>رقم الصمام: <strong>{valveId}</strong></div>
                    <div>وقت البدء: <strong>{currentTime}</strong></div>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>اسم المفتش المسؤول:</label>
                    <input required placeholder="أدخل اسمك الكامل" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setFormData({ ...formData, inspector: e.target.value })} />
                </div>

                {renderQuestion('isOpen', 'هل الصمام مفتوح بالكامل؟', formData.isOpen, (v) => setFormData({ ...formData, isOpen: v }))}
                {renderQuestion('isLocked', 'هل الصمام مؤمن (قفل/مراقبة)؟', formData.isLocked, (v) => setFormData({ ...formData, isLocked: v }))}
                {renderQuestion('noLeaks', 'هل الصمام سليم من التسريبات؟', formData.noLeaks, (v) => setFormData({ ...formData, noLeaks: v }))}
                {renderQuestion('hasTag', 'هل لوحة التعريف (Tag) موجودة؟', formData.hasTag, (v) => setFormData({ ...formData, hasTag: v }))}

                <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>ملاحظات فنية إضافية:</label>
                    <textarea rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                </div>

                <button type="submit" disabled={loading} style={{ padding: '20px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 12px rgba(211,47,47,0.3)', marginTop: '10px' }}>
                    {loading ? 'جاري رفع التقرير...' : 'إعتماد التقرير النهائي'}
                </button>
            </form>
        </div>
    );
}
