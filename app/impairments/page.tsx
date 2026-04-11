'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function ImpairmentsBoard() {
    const [impairments, setImpairments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // بيانات الإدخال
    const [systemName, setSystemName] = useState('نظام الرشاشات الآلية (Sprinklers)');
    const [issueType, setIssueType] = useState('عطل (Deficiency)');
    const [description, setDescription] = useState('');
    const [reportedBy, setReportedBy] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
    const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
    const supabase = createClient(supabaseUrl, supabaseKey);

    useEffect(() => {
        fetchImpairments();
    }, []);

    const fetchImpairments = async () => {
        const { data, error } = await supabase
            .from('impairments')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setImpairments(data);
        }
        setLoading(false);
    };

    const handleReport = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase.from('impairments').insert([{ 
            system_name: systemName, 
            issue_type: issueType, 
            description: description,
            reported_by: reportedBy,
            status: 'نشط'
        }]);

        if (error) {
            alert("حدث خطأ أثناء الإبلاغ: " + error.message);
        } else {
            alert("تم تسجيل البلاغ بنجاح وتعميمه في اللوحة!");
            setDescription('');
            setReportedBy('');
            fetchImpairments(); // تحديث اللوحة فوراً
        }
        setIsSubmitting(false);
    };

    const handleResolve = async (id: string) => {
        if(confirm('هل أنت متأكد من إصلاح هذا الخلل وإغلاق البلاغ؟')) {
            await supabase.from('impairments').update({ status: 'تم الإصلاح' }).eq('id', id);
            fetchImpairments();
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', direction: 'rtl', maxWidth: '1200px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #d32f2f', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1 style={{ color: '#d32f2f', margin: 0 }}>سجل الأعطال والإعاقات (Impairments)</h1>
                <Link href="/" style={{ padding: '10px 20px', background: '#333', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>العودة للرئيسية</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                
                {/* نموذج تسجيل بلاغ جديد */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>الإبلاغ عن خلل جديد</h3>
                    <form onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>النظام المتعطل:</label>
                            <select style={{ width: '100%', padding: '10px', borderRadius: '5px' }} value={systemName} onChange={e => setSystemName(e.target.value)}>
                                <option value="نظام الرشاشات الآلية (Sprinklers)">نظام الرشاشات الآلية (Sprinklers)</option>
                                <option value="مضخات الحريق (Fire Pumps)">مضخات الحريق (Fire Pumps)</option>
                                <option value="صمامات التحكم (Control Valves)">صمامات التحكم (Control Valves)</option>
                                <option value="نظام الإنذار (Fire Alarm)">نظام الإنذار (Fire Alarm)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>تصنيف الخلل (حسب NFPA):</label>
                            <select style={{ width: '100%', padding: '10px', borderRadius: '5px', fontWeight: 'bold', color: issueType.includes('إعاقة') ? 'red' : '#d84315' }} value={issueType} onChange={e => setIssueType(e.target.value)}>
                                <option value="عطل (Deficiency)">عطل (Deficiency) - النظام يعمل جزئياً</option>
                                <option value="إعاقة (Impairment)">إعاقة (Impairment) - النظام خارج الخدمة تماماً!</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>اسم المُبلّغ / المفتش:</label>
                            <input required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} value={reportedBy} onChange={e => setReportedBy(e.target.value)} />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>وصف المشكلة:</label>
                            <textarea required rows={4} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <button type="submit" disabled={isSubmitting} style={{ padding: '15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                            {isSubmitting ? 'جاري الإرسال...' : 'تسجيل البلاغ'}
                        </button>
                    </form>
                </div>

                {/* لوحة عرض البلاغات */}
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                    <h3 style={{ marginTop: 0 }}>لوحة المراقبة المباشرة</h3>
                    {loading ? (
                        <p>جاري تحميل البيانات...</p>
                    ) : impairments.length === 0 ? (
                        <p style={{ color: 'green', fontWeight: 'bold' }}>جميع الأنظمة تعمل بكفاءة. لا توجد بلاغات نشطة.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {impairments.map((imp, idx) => {
                                const isImpairment = imp.issue_type.includes('إعاقة');
                                const isResolved = imp.status === 'تم الإصلاح';
                                return (
                                    <div key={idx} style={{ 
                                        background: '#fff', padding: '15px', borderRadius: '8px', 
                                        borderRight: `5px solid ${isResolved ? 'green' : (isImpairment ? 'red' : 'orange')}`,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        opacity: isResolved ? 0.6 : 1
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h4 style={{ margin: 0, color: isResolved ? 'green' : (isImpairment ? 'red' : '#d84315') }}>
                                                {imp.issue_type} - {imp.system_name}
                                            </h4>
                                            <span style={{ fontSize: '12px', color: '#666' }}>{new Date(imp.created_at).toLocaleString('ar-SA')}</span>
                                        </div>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong>الوصف:</strong> {imp.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                                            <span><strong>المُبلّغ:</strong> {imp.reported_by}</span>
                                            
                                            {!isResolved ? (
                                                <button onClick={() => handleResolve(imp.id)} style={{ padding: '5px 15px', background: 'green', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                                                    ✓ تحديد كـ "تم الإصلاح"
                                                </button>
                                            ) : (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>تمت المعالجة</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
