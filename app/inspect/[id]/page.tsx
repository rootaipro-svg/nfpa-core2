'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function ProfessionalInspection() {
    const params = useParams();
    const valveIdFromQR = params?.id;
    
    const [inspectorName, setInspectorName] = useState('');
    const [isFullyOpen, setIsFullyOpen] = useState(true);
    const [hasLeaks, setHasLeaks] = useState(false);
    const [notes, setNotes] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createClient('https://uysfhchahbayozbisppy.supabase.co', 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML');

    const handleInspect = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            let photoUrl = '';
            
            // 1. رفع الصورة أولاً إذا وجدت
            if (imageFile) {
                const fileName = `${Date.now()}-${valveIdFromQR}.jpg`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('inspection-photos')
                    .upload(fileName, imageFile);
                
                if (uploadError) throw uploadError;
                
                const { data: publicUrlData } = supabase.storage
                    .from('inspection-photos')
                    .getPublicUrl(fileName);
                photoUrl = publicUrlData.publicUrl;
            }

            // 2. البحث عن الـ UUID للصمام
            const { data: valveData } = await supabase.from('fire_valves').select('id').eq('valve_number', valveIdFromQR).single();

            // 3. حفظ التقرير مع رابط الصورة
            const { error: insertError } = await supabase.from('valve_inspections').insert([{
                valve_id: valveData?.id,
                inspector_name: inspectorName,
                is_fully_open: isFullyOpen,
                has_leaks: hasLeaks,
                notes: notes,
                photo_url: photoUrl // حفظ الرابط هنا
            }]);

            if (insertError) throw insertError;
            alert("تم إرسال التقرير مع الصورة بنجاح!");
        } catch (err: any) {
            alert("خطأ: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', direction: 'rtl', maxWidth: '500px', margin: 'auto' }}>
            <h2 style={{ color: '#d32f2f' }}>فحص ميداني احترافي</h2>
            <form onSubmit={handleInspect} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input required placeholder="اسم المفتش" style={{ padding: '12px' }} onChange={e => setInspectorName(e.target.value)} />
                
                <label>الحالة الفنية:</label>
                <select style={{ padding: '12px' }} onChange={e => setIsFullyOpen(e.target.value === 'true')}>
                    <option value="true">مفتوح بالكامل (سليم)</option>
                    <option value="false">يوجد ملاحظات/مغلق</option>
                </select>

                <label>هل يوجد تسريب؟</label>
                <select style={{ padding: '12px' }} onChange={e => setHasLeaks(e.target.value === 'true')}>
                    <option value="false">لا يوجد تسريب</option>
                    <option value="true">يوجد تسريب (Needs Repair)</option>
                </select>

                {/* زر إرفاق الصورة */}
                <div style={{ border: '2px dashed #ccc', padding: '15px', textAlign: 'center' }}>
                    <label style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        📸 التقاط/إرفاق صورة للعطل
                        <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} 
                        onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
                    </label>
                    {imageFile && <p style={{ color: 'green', fontSize: '12px' }}>تم اختيار: {imageFile.name}</p>}
                </div>

                <textarea placeholder="ملاحظات فنية دقيقة..." rows={3} style={{ padding: '12px' }} onChange={e => setNotes(e.target.value)} />
                
                <button type="submit" disabled={loading} style={{ padding: '15px', background: '#d32f2f', color: '#fff', border: 'none', fontWeight: 'bold' }}>
                    {loading ? 'جاري الرفع والحفظ...' : 'إرسال التقرير النهائي'}
                </button>
            </form>
        </div>
    );
}
