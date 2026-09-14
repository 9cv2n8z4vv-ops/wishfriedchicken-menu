# Wish canlı kurulum durumu

Supabase projesi: Wish Fried Chicken
Project ref: rksvcpverjxthappjkma
Organizasyon: Hamza Sarı Hair Studio
Bölge: Frankfurt (eu-central-1)

Veritabanında 6 kategori, 35 ürün, 8 porsiyon seçeneği hazır. wishfc hesabı verilen başlangıç parolasının bcrypt hash'i ile oluşturuldu. WISH KOREAN CHICKEN fiyatı NULL. Migration ve seed tekrar gerekmez.

## Kalan adımlar

1. GitHub bağlantısı repoyu okuyor ancak yazma işlemini 403 ile reddediyor. Bu ZIP'in içindeki dosya ve klasörleri GitHub reposunun köküne yükleyebilirsiniz. ZIP dosyasının kendisini yüklemeyin. package.json repo kökünde olmalı.
2. Eski PACKED__*.srcpack dosyaları, restore-structure.cjs ve structure-manifest.json bu sürümde kullanılmaz. Normal app/, components/, lib/, public/ klasörleri pakette hazırdır.
3. Supabase Dashboard → Wish Fried Chicken → Connect → Transaction pooler bağlantı adresini alın. Bağlantı adresindeki parola alanını veritabanı parolasıyla doldurun. Veritabanı parolasını bilmiyorsanız Dashboard'daki Database Settings üzerinden belirleyin; bu işlem admin giriş parolasını değiştirmez.
4. Vercel → wishfriedchicken-menu → Settings → Environment Variables altında DATABASE_URL olarak bağlantıyı, DATABASE_SSL olarak true değerini ekleyin. Şifreli bağlantı adresini GitHub'a veya sohbet mesajına yazmayın.
5. Vercel Framework Preset Next.js, Node.js 22 veya 24 olmalı. Deploy/redeploy yapın. SITE_URL alanına Vercel'in verdiği tam HTTPS site origin'ini ekleyin (sonunda slash olmadan).
6. / menüsünü ve /admin girişini açıp bir fiyat güncellemesini kontrol edin.

Bu sürümün çalışan canlı URL'si henüz doğrulanmadı. Supabase'in proje oluşturma sırasında bildirdiği başlangıç maliyeti 0 USD/aydır; sonradan plan/kullanım değişiklikleri ayrıca değerlendirilmelidir.
