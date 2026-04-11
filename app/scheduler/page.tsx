'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function SchedulerPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
    const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';
    const supabase = createClient(supabaseUrl, supabaseKey);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        const { data } = await supabase.from('schedules').select('*').order('due_date', { ascending: true });
        if (data) setTasks(data);
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {tasks.map((task, idx) => (
                    <div key={idx} style={{ 
                        background: getStatusColor(task.due_date, task.status), 
                        padding: '20px', borderRadius: '12px', border: '1px solid #ddd',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', background: '#fff' }}>{task.frequency}</span>
                            <span style={{ fontSize: '12px' }}>تاريخ الاستحقاق: {task.due_date}</span>
                        </div>
                        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>{task.task_name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: task.status === 'مكتمل' ? 'green' : (task.due_date < new Date().toISOString().split('T')[0] ? 'red' : '#0066cc') }}>
                                الحالة: {task.status}
                            </td>
                            {task.status !== 'مكتمل' && (
                                <button onClick={async () => {
                                    await supabase.from('schedules').update({ status: 'مكتمل' }).eq('id', task.id);
                                    fetchTasks();
                                }} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #333', borderRadius: '5px', cursor: 'pointer' }}>
                                    تحديد كمكتمل
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* إحصائيات سريعة */}
            <div style={{ marginTop: '40px', padding: '20px', background: '#333', color: '#fff', borderRadius: '10px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                    <h2 style={{ margin: 0 }}>{tasks.filter(t => t.status === 'مكتمل').length}</h2>
                    <p style={{ margin: 0 }}>مهام مكتملة</p>
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>{tasks.filter(t => t.due_date < new Date().toISOString().split('T')[0] && t.status !== 'مكتمل').length}</h2>
                    <p style={{ margin: 0, color: '#ff5252' }}>مهام متأخرة</p>
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>{Math.round((tasks.filter(t => t.status === 'مكتمل').length / tasks.length) * 100) || 0}%</h2>
                    <p style={{ margin: 0, color: '#4caf50' }}>مؤشر الامتثال (Compliance)</p>
                </div>
            </div>
        </div>
    );
}
