'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function InspectValve() {
    const params = useParams();
    const urlParam = params?.id; // هذا رقم الصمام القادم من الباركود (مثلاً V-101)
    
    // مطابقة حقول جدولك الاحترافي
    const [inspectorName, setInspectorName] = useState('');
    const [isFullyOpen, setIsFullyOpen] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [hasLeaks, setHasLeaks] = useState(false);
    const [hasId, setHasId] = useState(true);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInspect = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
        const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
        
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            // 1. نبحث أولاً عن الـ UUID الخاص بالصمام لأن جدولك يشترطه
            const { data: valveData, error: valveError } = await supabase
                .from('fire_valves')
                .select('id')
                .eq('valve_number', urlParam)
                .single();

            if (valveError || !valveData) {
                alert("عذراً، لم يتم العثور على هذا الصمام في قاعدة البيانات الرئيسية.");
                setLoading(false);
                return;
            }

            // 2. إرسال تقرير الفحص لجدول valve_inspections الخاص بك
            const { error } = await supabase
                .from('valve_inspections')
                .insert([{ 
                    valve_id: valveData.id,
                    inspector_name: inspectorName,
                    is_fully_open: isFullyOpen,
                    is_locked_or_supervised: isLocked,
                    has_leaks: hasLeaks,
                    has_identification: hasId,
                    notes: notes 
                }]);

            if (error) {
                alert("حدث خطأ أثناء الإرسال: " + error.message);
            } else {
                alert("تم إرسال تقرير الفحص الميداني بنجاح!");
                // تفريغ الحقول بعد النجاح
                setInspectorName('');
                setNotes('');
            }
        } catch (err) {
            alert("خطأ في الاتصال بقاعدة البيانات");
        }
        
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', direction: 'rtl', maxWidth: '400px', margin: 'auto' }}>
            <h2 style={{ color: '#d32f2f', borderBottom: '2px solid #d32f2f', paddingBottom: '10px' }}>قائمة فحص NFPA 25</h2>
            
            <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '16px' }}><strong>رقم الصمام:</strong> <span style={{ color: '#0066cc', fontWeight: 'bold' }}>{urlParam}</span></p>
            </div>

            <form onSubmit={handleInspect} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>اسم المفتش:</label>
                    <input required placeholder="اكتب اسمك هنا..." style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }} value={inspectorName} onChange={e => setInspectorName(e.target.value)} />
                </div>

                <div style={{ background: '#fff9c4', padding: '10px', borderRadius: '5px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>هل الصمام مفتوح بالكامل؟</label>
                    <select style={{ width: '100%', padding: '10px', borderRadius: '5px' }} onChange={e => setIsFullyOpen(e.target.value === 'true')}>
                        <option value="true">نعم (مفتوح بالكامل)</option>
                        <option value="false">لا (مغلق أو مفتوح جزئياً)</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>هل الصمام مقفل بقفل أو مراقب؟</label>
                    <select style={{ width: '100%', padding: '10px', borderRadius: '5px' }} onChange={e => setIsLocked(e.target.value === 'true')}>
                        <option value="true">نعم (مقفل/مراقب)</option>
                        <option value="false">لا (غير مقفل)</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>هل يوجد أي تسريب مرئي؟</label>
                    <select style={{ width: '100%', padding: '10px', borderRadius: '5px' }} onChange={e => setHasLeaks(e.target.value === 'true')}>
                        <option value="false">لا (سليم)</option>
                        <option value="true">نعم (يوجد تسريب)</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>هل توجد لوحة تعريفية (Tag)؟</label>
                    <select style={{ width: '100%', padding: '10px', borderRadius: '5px' }} onChange={e => setHasId(e.target.value === 'true')}>
                        <option value="true">نعم (موجودة)</option>
                        <option value="false">لا (مفقودة)</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>ملاحظات إضافية:</label>
                    <textarea placeholder="اكتب أي عيوب أو ملاحظات..." rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }} value={notes} onChange={e => setNotes(e.target.value)} />
                </div>

                <button type="submit" disabled={loading} style={{ padding: '15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                    {loading ? 'جاري الإرسال...' : 'اعتماد تقرير الفحص'}
                </button>
            </form>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>العودة للرئيسية</Link>
            </div>
        </div>
    );
}
