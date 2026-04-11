'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function SchedulerPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // مفاتيحك التي زودتني بها مدمجة هنا للعمل فوراً
    const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
    const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
    const supabase = createClient(supabaseUrl, supabaseKey);

    useEffect(() => { 
        fetchTasks(); 
    }, []);

    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('schedules')
                .select('*')
                .order('due_date', { ascending: true });
            
            if (error) throw error;
            if (data) setTasks(data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
        setLoading(false);
    };

    const getStatusColor = (dueDate: string, status: string) => {
        if (status === 'مكتمل') return '#e8f5e9'; // أخضر
        const today = new Date().toISOString().split('T')[0];
        return dueDate < today ? '#ffebee' : '#e3f2fd'; // أحمر للمتأخر، أزرق للقادم
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', direction: 'rtl', maxWidth: '1200px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #d32f2f', paddingBottom: '10px', marginBottom: '30px' }}>
                <h1 style={{ color: '#d32f2f', margin: 0 }}>مخطط الصيانة والامتثال (ITM Scheduler)</h1>
                <Link href="/" style={{ padding: '10px 20px', background: '#333', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>العودة للرئيسية</Link>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', fontSize: '18px' }}>جاري تحميل جدول المواعيد...</p>
            ) : tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '10px' }}>
                    <p style={{ fontSize: '18px', color: '#666' }}>لا توجد مهام مجدولة. تأكد من تنفيذ أمر SQL في Supabase.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {tasks.map((task, idx) => {
                        const isLate = task.due_date < new Date().toISOString().split('T')[0] && task.status !== 'مكتمل';
                        return (
                            <div key={idx} style={{ 
                                background: getStatusColor(task.due_date, task.status), 
                                padding: '20px', borderRadius: '12px', border: '1px solid #ddd',
                                borderRight: `8px solid ${task.status === 'مكتمل' ? 'green' : (isLate ? 'red' : '#0066cc')}`,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', background: '#fff' }}>{task.frequency}</span>
                                    <span style={{ fontSize: '12px' }}>استحقاق: {task.due_date}</span>
                                </div>
                                <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>{task.task_name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: task.status === 'مكتمل' ? 'green' : (isLate ? 'red' : '#0066cc') }}>
                                        {task.status}
                                    </span>
                                    {task.status !== 'مكتمل' && (
                                        <button onClick={async () => {
                                            await supabase.from('schedules').update({ status: 'مكتمل' }).eq('id', task.id);
                                            fetchTasks();
                                        }} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #333', borderRadius: '5px', cursor: 'pointer' }}>
                                            إتمام المهمة
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {tasks.length > 0 && (
                <div style={{ marginTop: '40px', padding: '20px', background: '#333', color: '#fff', borderRadius: '10px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                        <h2 style={{ margin: 0 }}>{tasks.filter(t => t.status === 'مكتمل').length}</h2>
                        <p style={{ margin: 0 }}>مكتملة</p>
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{tasks.filter(t => t.due_date < new Date().toISOString().split('T')[0] && t.status !== 'مكتمل').length}</h2>
                        <p style={{ margin: 0, color: '#ff5252' }}>متأخرة</p>
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{Math.round((tasks.filter(t => t.status === 'مكتمل').length / tasks.length) * 100)}%</h2>
                        <p style={{ margin: 0, color: '#4caf50' }}>الامتثال</p>
                    </div>
                </div>
            )}
        </div>
    );
}
