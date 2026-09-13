# Project Summary

Bu teslimat Wish Fried Chicken dijital menü sistemi için kaynak kod paketidir.

## Tamamlanan ana özellikler

- Mobile-first public menü
- Referans Wish Fried Chicken logosu (`public/wish-logo.png` ve full referans)
- Marka renkleri `#F4EFE6` / `#5D2A2C`
- Impact tabanlı güçlü tipografi
- Sticky ve yatay kaydırılabilir kategori navigasyonu
- Scroll sırasında aktif kategori tespiti
- PostgreSQL/Supabase persistent data modeli
- Kategori CRUD + görünürlük + sıralama
- Ürün CRUD + görünürlük + sıralama
- Ürün arama
- 0–3 acılık seviyesi
- Tek fiyat ve dinamik çoklu fiyat seçenekleri
- Drag & drop kategori ve ürün sıralama
- Custom delete confirmation modal
- Admin toast/feedback state'leri
- Server-side bcrypt authentication
- HttpOnly / SameSite / production Secure cookie
- Database-backed, hashed session token sistemi
- Same-origin mutation kontrolü
- Public/admin hata durumları
- Dynamic rendering + revalidation
- SEO metadata + Open Graph + robots
- Migration + seed + README + Vercel checklist

## Kaynak veri doğrulamaları

- Seed içinde 6 kategori vardır.
- Seed içinde 35 ürün vardır.
- WISH KOREAN CHICKEN fiyatı `null` olarak bırakılmıştır.
- Başlangıç admin şifresi proje kaynak kodunda düz metin olarak yer almaz; environment variable ile seed edilir.

## Bu ortamda yapılan doğrulama

- Tüm `.ts` / `.tsx` dosyaları TypeScript parser ile parse edildi: syntax error yok.
- Kaynak kodda başlangıç admin şifresi literal olarak aranıp bulunmadı.
- Marka renkleri CSS değişkenlerinde doğrulandı.
- Logo kaynak dosyası projeye kopyalandı; header/login için boşlukları azaltılmış referans crop ayrıca üretildi.

## Bu ortamda yapılamayan doğrulama

Çalışma ortamında npm registry erişimi olmadığı ve `node_modules` bulunmadığı için `npm install`, `next build` ve gerçek PostgreSQL entegrasyon testi çalıştırılamadı. Vercel'e göndermeden önce README'deki environment variable'ları ayarlayıp şu komutların çalıştırılması gerekir:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run check
npm run build
```
