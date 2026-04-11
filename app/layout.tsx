import Link from 'next/link';

export const metadata = {
  title: 'نظام NFPA 25 - إدارة الصمامات',
  description: 'نظام ذكي لإدارة وفحص صمامات الحريق',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
        
        {/* شريط التصفح العلوي */}
        <nav style={{ backgroundColor: '#d32f2f', padding: '15px 30px', display: 'flex', gap: '25px', color: 'white', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, marginLeft: 'auto', fontSize: '22px' }}>NFPA 25 System</h2>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>الرئيسية</Link>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>تقارير الفحص</Link>
          <Link href="/valves" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>سجل الصمامات</Link>
          <Link href="/pump-test" style={{ color: '#ffeb3b', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>⚙️ اختبار المضخات</Link>
          <Link href="/impairments" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>⚠️ سجل الأعطال</Link>
       <Link href="/scheduler" style={{ color: '#00bcd4', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>📅 الجدولة الذكية</Link>
        </nav>

        <main>
          {children}
        </main>
        
      </body>
    </html>
  )
}
