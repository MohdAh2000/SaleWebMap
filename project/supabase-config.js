// إعدادات Supabase
const SUPABASE_CONFIG = {
    url: 'https://khvmaiwcbyhigkcumkml.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtodm1haXdjYnloaWdrY3Vta21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTU2NjYsImV4cCI6MjA3MjEzMTY2Nn0.6h9PtDe0FeElVsCePDkd6h7xNeFoDPRRd4S7DF2_Nhw'
};

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
} else {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
