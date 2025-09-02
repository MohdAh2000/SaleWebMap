# دليل نشر المشروع على Supabase

## الخطوة 1: إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط على "Start your project"
3. سجل دخول بحساب GitHub أو Google
4. اضغط على "New Project"
5. اختر اسم للمشروع (مثل: `real-estate-app`)
6. اختر كلمة مرور قوية لقاعدة البيانات
7. اختر المنطقة الأقرب لك
8. انتظر حتى يكتمل إنشاء المشروع (5-10 دقائق)

## الخطوة 2: إعداد قاعدة البيانات

1. في لوحة التحكم، اذهب إلى "SQL Editor"
2. انسخ محتوى ملف `supabase-schema.sql`
3. اضغط على "Run" لتنفيذ الكود
4. انتقل إلى "Table Editor" للتأكد من إنشاء الجدول

## الخطوة 3: إعداد التخزين (Storage)

1. اذهب إلى "Storage" في القائمة الجانبية
2. اضغط على "New Bucket"
3. اسم الحاوية: `property-photos`
4. اختر "Public" لجعل الصور متاحة للعامة
5. اضغط على "Create bucket"

## الخطوة 4: إعداد المصادقة (Authentication)

1. اذهب إلى "Authentication" > "Settings"
2. في "Site URL" ضع: `https://your-project-ref.supabase.co`
3. في "Redirect URLs" أضف: `https://your-project-ref.supabase.co/auth/callback`
4. احفظ التغييرات

## الخطوة 5: إنشاء مستخدم تجريبي

1. اذهب إلى "Authentication" > "Users"
2. اضغط على "Add user"
3. أدخل بريد إلكتروني وكلمة مرور
4. اضغط على "Create user"

## الخطوة 6: تحديث ملفات المشروع

1. في `script-supabase.js`، استبدل:
   - `YOUR_SUPABASE_URL_HERE` بـ URL مشروعك
   - `YOUR_SUPABASE_ANON_KEY_HERE` بـ المفتاح العام

2. للحصول على هذه المعلومات:
   - اذهب إلى "Settings" > "API"
   - انسخ "Project URL" و "anon public" key

## الخطوة 7: رفع الملفات

### الطريقة الأولى: رفع يدوي
1. اذهب إلى "Storage" > "Create bucket"
2. اسم الحاوية: `website-files`
3. اختر "Public"
4. ارفع الملفات التالية:
   - `index-supabase.html` (أعد تسميته إلى `index.html`)
   - `script-supabase.js` (أعد تسميته إلى `script.js`)
   - `style.css`
   - `logo.png`
   - `middle.geojson`

### الطريقة الثانية: استخدام GitHub Pages
1. ارفع المشروع إلى GitHub
2. اذهب إلى "Settings" > "Pages"
3. اختر "Deploy from a branch"
4. اختر الفرع الرئيسي
5. اضغط على "Save"

## الخطوة 8: اختبار التطبيق

1. افتح التطبيق في المتصفح
2. جرب تسجيل الدخول بالمستخدم التجريبي
3. أضف عقار جديد
4. تأكد من ظهوره على الخريطة

## الميزات المتاحة بعد النشر:

✅ **قاعدة بيانات PostgreSQL** - بدلاً من MongoDB  
✅ **مصادقة آمنة** - تسجيل دخول/خروج  
✅ **تخزين الصور** - رفع وإدارة الصور  
✅ **API تلقائي** - REST API جاهز  
✅ **أمان متقدم** - Row Level Security  
✅ **نشر عالمي** - CDN عالمي  
✅ **HTTPS تلقائي** - أمان إضافي  

## استكشاف الأخطاء:

### مشكلة في الاتصال بقاعدة البيانات:
- تأكد من صحة URL والمفتاح
- تحقق من إعدادات RLS

### مشكلة في رفع الصور:
- تأكد من إنشاء bucket `property-photos`
- تحقق من صلاحيات الحاوية

### مشكلة في المصادقة:
- تأكد من إعدادات Site URL
- تحقق من Redirect URLs

## التطوير المستقبلي:

- إضافة إشعارات في الوقت الفعلي
- إضافة تعليقات على العقارات
- إضافة نظام تقييم
- إضافة إحصائيات متقدمة
- إضافة تطبيق موبايل

## الدعم:

- [وثائق Supabase](https://supabase.com/docs)
- [مجتمع Supabase](https://github.com/supabase/supabase/discussions)
- [Discord](https://discord.supabase.com)
