import { createClient } from '@supabase/supabase-js';

// وضعنا المفاتيح هنا مباشرة لنتجاوز مشاكل إعدادات Vercel نهائياً
const supabaseUrl = 'https://uysfhchahbayozbisppy.supabase.co';
const supabaseKey = 'sb_publishable_T03nYMwpGp1uXXTPLqx_1Q_JnzMuqML';

export const supabase = createClient(supabaseUrl, supabaseKey);
