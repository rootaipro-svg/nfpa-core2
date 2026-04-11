import { createClient } from '@supabase/supabase-js';

// نضع مفاتيح وهمية كـ "بديل احتياطي" فقط لتجاوز فحص Vercel أثناء البناء
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-to-pass-build';

export const supabase = createClient(supabaseUrl, supabaseKey);
