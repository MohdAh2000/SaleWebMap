# دليل إعداد Supabase السريع 🚀

## 1. إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط على "Start your project"
3. سجل دخول أو أنشئ حساب جديد
4. اضغط على "New Project"
5. اختر اسم للمشروع (مثال: `real-estate-map`)
6. اختر كلمة مرور قوية لقاعدة البيانات
7. اختر المنطقة الأقرب لك
8. انتظر حتى يتم إنشاء المشروع (5-10 دقائق)

## 2. الحصول على معلومات الاتصال

1. في لوحة التحكم، اذهب إلى "Settings" → "API"
2. انسخ:
   - **Project URL** (مثال: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (مثال: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. تحديث ملف الإعدادات

1. افتح `supabase-config.js`
2. استبدل:
   ```javascript
   url: 'YOUR_SUPABASE_URL_HERE',
   anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'
   ```
3. بالقيم الحقيقية:
   ```javascript
   url: 'https://abcdefghijklmnop.supabase.co',
   anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   ```

## 4. إعداد قاعدة البيانات

1. في لوحة التحكم، اذهب إلى "SQL Editor"
2. انسخ محتوى `supabase-schema.sql`
3. الصق الكود واضغط "Run"
4. تأكد من نجاح التنفيذ

## 5. إعداد التخزين

1. اذهب إلى "Storage" → "Buckets"
2. اضغط على "New Bucket"
3. اسم: `properties`
4. Public: ✅ (مفعل)
5. File size limit: `5MB`
6. Allowed MIME types: `image/*`

## 6. إعداد سياسات RLS للتخزين

1. اذهب إلى "Storage" → "Policies"
2. اضغط على "New Policy"
3. اختر "Create a policy from scratch"
4. Policy name: `Allow public read access`
5. Target roles: `public`
6. Policy definition:
   ```sql
   SELECT true;
   ```
7. اضغط "Review" ثم "Save policy"

## 7. إعداد المصادقة

1. اذهب إلى "Authentication" → "Settings"
2. في "Site URL" أضف رابط موقعك
3. في "Redirect URLs" أضف:
   - `http://localhost:3000`
   - `https://yourdomain.com`

## 8. إنشاء مستخدم تجريبي

1. اذهب إلى "Authentication" → "Users"
2. اضغط على "Add user"
3. أدخل:
   - Email: `test@example.com`
   - Password: `password123`
4. اضغط "Create user"

## 9. اختبار التطبيق

1. شغل التطبيق محلياً: `npm run dev`
2. افتح `http://localhost:3000`
3. جرب تسجيل الدخول بالمستخدم التجريبي
4. جرب إضافة عقار جديد

## 10. النشر

### خيار 1: Supabase Hosting
1. اذهب إلى "Settings" → "General"
2. في "Custom domains" أضف نطاقك
3. ارفع الملفات إلى Supabase Storage

### خيار 2: GitHub Pages
1. ارفع المشروع إلى GitHub
2. فعّل GitHub Pages
3. اختر الفرع الرئيسي

### خيار 3: Netlify
1. ارفع الملفات إلى Netlify
2. اضبط إعدادات النشر

## 🔧 استكشاف الأخطاء

### مشكلة: "Supabase غير متصل"
- تأكد من صحة URL و API Key
- تحقق من اتصال الإنترنت
- تأكد من أن المشروع نشط

### مشكلة: "فشل في رفع الصورة"
- تحقق من إعدادات Storage
- تأكد من حجم الملف (أقل من 5MB)
- تحقق من سياسات RLS

### مشكلة: "فشل في تسجيل الدخول"
- تأكد من إعدادات المصادقة
- تحقق من Redirect URLs
- تأكد من وجود المستخدم

## 📞 الدعم

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

**ملاحظة**: تأكد من تحديث `supabase-config.js` بمعلومات مشروعك قبل النشر!
