# Doğrulama raporu

## Tamamlanan kontroller

| Kontrol | Sonuç |
| --- | --- |
| Next.js 15.5.25 production build ve TypeScript | Başarılı |
| Başlangıç migration ve seed | 6 kategori, 35 ürün, 8 porsiyon seçeneği |
| WISH KOREAN CHICKEN fiyatı | SQL NULL; public menüde “Fiyat bilgisi yakında” |
| Public menü | 35 ürün render ediliyor; aktif/boş kategori filtreleri çalışıyor |
| Güvenli login | Sunucuda bcrypt doğrulama; HttpOnly/Secure cookie |
| Oturumsuz admin sayfası | Login yönlendirmesi |
| Oturumsuz yönetim API | 401, yazma işlemi yapılmıyor |
| Kategori ve ürün CRUD | API üzerinden eklendi, düzenlendi ve silindi |
| Fiyat güncellemesi | 420,25 TL public menüde sonraki istekte görüldü |
| Geçersiz fiyatlar | Negatif değer ve boolean reddedildi |
| Çoklu fiyat | Üç seçenek kaydedildi; SQL'de doğrulandı |
| Aktif/pasif | Ürün ve kategori gizlenmesi public menüde doğrulandı |
| Sıralama | Transaction ile yazıldı; SQL sorgusunda doğrulandı |
| Arama | “korean” üç ürün döndürdü |
| Logout | Session SQL kaydı silindi; eski cookie ile API 401 |
| Giriş denemesi sınırı | Limit sonrası 429 |
| RLS | Bütün uygulama tablolarında açık; anon rolünün admin tablosunu okuması reddedildi |
| Client secret kontrolü | app, components, lib ve .next/static içinde başlangıç parola eşleşmesi yok |
| Responsive | Chromium'da 320/390/768/1440 genişliklerinde yatay sayfa taşması yok |
| Marka renkleri | Computed CSS: rgb(244,239,230) ve rgb(93,42,44) |
| Silme penceresi | Tarayıcıda odak İptal'e taşınıyor, Escape kapatıyor; kategori ekleme/silme çalışıyor |
| Admin mobil görünüm | 390 pikselde sıralama ve mobil menü çalışıyor |
| Tarayıcı logout/back | Geri tuşuyla admin içeriğine erişilemiyor |
| Masaüstü tipografi | Kategori başlığı tek satıra sığıyor; açıklama ürün sütununa taşmıyor |

API testleri `tests/integration.mjs` ve `tests/verify-api.mjs` içindedir. `npm run test:integration` production build alıp izole PGlite üzerinde çalıştırır; test parolası rastgele üretilir. Test için 3000 ve 55433 portları boş olmalıdır. Test veritabanı production bağlantısını kullanmaz.

Browser kontrolleri Chromium + Playwright ile ayrı QA ortamında yürütüldü. Ekran görüntüleri indirilebilir proje paketine dahildir. Impact bilgisayarda kurulu olmadığından test tarayıcısında fallback font render edildi; CSS font zincirinin Impact ile başladığı doğrulandı.

## Canlı kurulum durumu

- Hamza Sarı Hair Studio organizasyonunda ayrı Wish Fried Chicken projesi oluşturuldu (Frankfurt).
- Başlangıç şeması uygulandı; 6 kategori, 35 ürün ve 8 fiyat seçeneği canlı SQL sorgusunda doğrulandı.
- wishfc hesabı bcrypt hash ile oluşturuldu; parola hiçbir kaynak dosyada bulunmaz.
- Supabase güvenlik denetiminde yalnızca bilinçli server-only erişim için RLS policy bulunmadığına dair INFO kayıtları var. Anon/authenticated erişim kapalıdır.
- GitHub okuma erişimi doğrulandı; yazma isteği GitHub API tarafından 403 Resource not accessible by integration ile reddedildi. Kod henüz GitHub’a gönderilmedi. Yerel kaynak normal Next.js klasör yapısına geçirildi.
- Vercel runtime için DATABASE_URL ve SITE_URL kurulumu henüz tamamlanmadı; bu sürümün çalışan canlı menü URL'si henüz doğrulanmadı.
- Impact kurulu olmayan cihazlarda fallback font kullanılır. Lisanslı Impact WOFF2 sağlanmadı.
