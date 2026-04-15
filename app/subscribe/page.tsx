'use client'
import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createClient } from '@supabase/supabase-js';

export default function SubscribePage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // ربط قاعدة بياناتك
    const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
    const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ✅ المفاتيح التي استخرجناها من كود PayPal الخاص بك
    const PAYPAL_CLIENT_ID = "AaPEpPOG2Dg4f4FDqeVKjJv2kiBByVJ-dnjjyluw_aU2oqo5mJEukLG7gxuK_veLQVaGB1WasnfZ9dHa";
    const PAYPAL_PLAN_ID = "P-6JX42750NJ333051UNHPQS2Y";

    const handleApprove = async (data: any, actions: any) => {
        setLoading(true);
        try {
            // حفظ بيانات المشترك في قاعدة البيانات لديك فور نجاح الدفع
            const { error } = await supabase.from('digital_subscriptions').insert([{ 
                user_email: email, 
                plan_name: 'الاشتراك الماسي - NFPA 25',
                paypal_subscription_id: data.subscriptionID,
                status: 'ACTIVE'
            }]);

            if (error) throw error;
            setIsSuccess(true);
        } catch (err) {
            alert("تم الدفع، ولكن حدث خطأ في تسجيل إيميلك في النظام. يرجى التواصل مع الإدارة.");
            console.error(err);
        }
        setLoading(false);
    };

    if (isSuccess) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial', direction: 'rtl', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 style={{ color: 'green', fontSize: '40px' }}>🎉 تم تفعيل اشتراكك بنجاح!</h1>
                <p style={{ fontSize: '20px', color: '#333' }}>تم تسجيل إيميلك ({email}) ويمكنك الآن الوصول للنظام بالكامل.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', fontFamily: 'Arial', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#d32f2f', margin: '0 0 10px 0', fontSize: '28px' }}>الاشتراك الماسي 💎</h2>
                    <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>وصول كامل لنظام إدارة وفحص معدات الحريق المتوافقة مع كود البناء السعودي ومعايير الدفاع المدني.</p>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>البريد الإلكتروني (لتفعيل الحساب):</label>
                    <input 
                        type="email" 
                        required 
                        placeholder="أدخل بريدك الإلكتروني هنا..." 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '16px', boxSizing: 'border-box', outline: 'none' }}
                    />
                </div>

                {email.includes('@') && email.includes('.') ? (
                    <div style={{ marginTop: '20px' }}>
                        <PayPalScriptProvider options={{ "clientId": PAYPAL_CLIENT_ID, vault: true, intent: "subscription" }}>
                            <PayPalButtons 
                                createSubscription={(data, actions) => {
                                    return actions.subscription.create({
                                        plan_id: PAYPAL_PLAN_ID
                                    });
                                }}
                                onApprove={handleApprove}
                                style={{ label: 'subscribe', color: 'gold', shape: 'rect' }}
                            />
                        </PayPalScriptProvider>
                    </div>
                ) : (
                    <div style={{ padding: '15px', background: '#ffebee', color: '#d32f2f', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold' }}>
                        الرجاء إدخال بريد إلكتروني صحيح لظهور أزرار الدفع
                    </div>
                )}
                
                {loading && <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontWeight: 'bold' }}>⏳ جاري تأكيد وتفعيل الاشتراك...</p>}
            </div>
        </div>
    );
}
