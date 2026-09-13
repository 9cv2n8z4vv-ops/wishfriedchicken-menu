# Wish Fried Chicken — Dijital Menü Yönetim Sistemi

Vercel'e deploy edilebilen, mobile-first public menü ve güvenli yönetici paneli bulunan Next.js uygulamasıdır. Menü içeriği component'lere gömülü değildir; PostgreSQL/Supabase üzerinde kalıcı olarak saklanır. Kategori, ürün, fiyat, çoklu porsiyon fiyatları, acılık seviyesi, görünürlük ve sıralama admin panelinden değiştirilebilir.

## Teknolojiler

- Next.js App Router + TypeScript + React
- PostgreSQL / Supabase uyumlu doğrudan SQL katmanı (`postgres`)
- Server-side bcrypt parola doğrulama
- HttpOnly + SameSite session cookie
- Veritabanında SHA-256 hash'i tutulan rastgele session token'ları
- Responsive, framework-template hissinden uzak özel CSS
- Vercel uyumlu dinamik server rendering

## Sayfalar

- `/` — Public QR menüsü
- `/admin/login` — Yönetici girişi
- `/admin` — Dashboard
- `/admin/categories` — Kategori CRUD
- `/admin/products` — Ürün arama ve CRUD
- `/admin/menu` — Kategori ve ürün drag & drop sıralaması
- `/admin/settings` — Genel menü metinleri

## Local development

1. Node.js 20+ ve bir PostgreSQL veritabanı hazırlayın.
2. Proje klasöründe bağımlılıkları kurun:

```bash
npm install
```

3. `.env.example` dosyasını `.env.local` olarak kopyalayın.
4. `DATABASE_URL` değerini PostgreSQL/Supabase bağlantı adresinizle doldurun.
5. `ADMIN_SEED_USERNAME` alanını `wishfc` olarak bırakın.
6. `ADMIN_SEED_PASSWORD` alanını proje brief'inde verilen başlangıç admin şifresiyle yalnızca yerel/production environment variable olarak ayarlayın. Şifre hiçbir client component'e veya browser bundle'ına yazılmamalıdır.
7. Veritabanını hazırlayın:

```bash
npm run db:migrate
npm run db:seed
```

8. Uygulamayı başlatın:

```bash
npm run dev
```

## Environment variables

```env
DATABASE_URL=
DATABASE_SSL=true
ADMIN_SEED_USERNAME=wishfc
ADMIN_SEED_PASSWORD=
ADMIN_SESSION_HOURS=12
```

`DATABASE_SSL=false` yalnızca TLS kullanmayan güvenilir bir local PostgreSQL sunucusunda kullanılmalıdır. Supabase/Vercel production kullanımında TLS açık kalmalıdır.

## Supabase kurulumu

1. Supabase üzerinde yeni PostgreSQL projesi oluşturun.
2. Project Settings > Database bölümünden uygun connection string alın. Vercel/serverless kullanımında connection pooler adresi tercih edilebilir.
3. Connection string'i `DATABASE_URL` olarak ayarlayın.
4. `npm run db:migrate` ile tabloları ve index'leri oluşturun.
5. `npm run db:seed` ile başlangıç kategorilerini, ürünleri, fiyatları ve admin kullanıcısını oluşturun.

Seed, menü kategorileri zaten varsa menü verisini ikinci kez eklemez. Admin kullanıcısının parola hash'i ise seed sırasında environment variable üzerinden güncellenir.

## Veritabanı yapısı

Ana tablolar:

- `categories`
- `products`
- `product_price_options`
- `admin_users`
- `admin_sessions`
- `app_settings`

Silinen kategoriye bağlı ürünler ve ürün fiyat seçenekleri `ON DELETE CASCADE` ile temizlenir. Admin arayüzü silme öncesi ayrıca confirmation modal gösterir.

## Admin authentication

- Kullanıcı adı ve parola server-side doğrulanır.
- Parola bcrypt hash olarak `admin_users.password_hash` alanında tutulur.
- Başarılı girişte kriptografik rastgele session token üretilir.
- Tarayıcı yalnızca HttpOnly session cookie alır; düz parola veya hash browser'a gönderilmez.
- Veritabanında session token'ın kendisi değil SHA-256 hash'i tutulur.
- Cookie `SameSite=Lax`, production'da `Secure` ve `HttpOnly` olarak ayarlanır.
- `/admin` route'larında middleware cookie varlığını kontrol eder; asıl session geçerlilik kontrolü server layout ve API katmanında veritabanına karşı yapılır.
- Logout session kaydını siler ve cookie'yi expire eder.

## Menü güncelleme davranışı

Public menü dynamic rendering kullanır ve admin mutation route'ları `revalidatePath('/')` çağırır. Bu nedenle fiyat ve içerik değişikliklerinin eski cache üzerinden uzun süre gösterilmesi engellenir. Admin panelindeki kritik fiyat formlarında autosave yoktur; değişiklik açıkça **DEĞİŞİKLİKLERİ KAYDET** butonuyla kaydedilir.

## Çoklu fiyat sistemi

WINGS ürünleri `product_price_options` tablosunda dinamik label + fiyat satırları kullanır. Admin ürün formunda **Birden fazla fiyat seçeneği** açıldıktan sonra istenen sayıda seçenek eklenebilir; örneğin `5'Lİ`, `9'LU` veya daha sonra `12'Lİ`.

## Eksik fiyat davranışı

Kaynak menüde fiyatı bulunmayan ürünler `price = NULL` tutulabilir. Public menü bu durumda `0 TL`, `undefined`, `NaN` veya uydurma fiyat göstermez; `app_settings.missing_price_text` değerini kullanır.

## Vercel deployment

1. Projeyi GitHub/GitLab/Bitbucket'a push edin veya Vercel CLI kullanın.
2. Vercel projesini Next.js olarak import edin.
3. Production environment variables bölümüne en az `DATABASE_URL`, `DATABASE_SSL`, `ADMIN_SESSION_HOURS` ekleyin.
4. Seed işlemini local/CI ortamından production veritabanına karşı bir kez çalıştırın. `ADMIN_SEED_PASSWORD` yalnızca seed sırasında güvenli secret olarak verin.
5. Production build çalıştırın:

```bash
npm run build
```

6. Deploy sonrasında public menü `https://domain.com/`, admin paneli `https://domain.com/admin` üzerinden çalışır.

## Production güvenlik notları

- Gerçek secret'ları `.env.example`, Git veya client-side `NEXT_PUBLIC_*` değişkenlerine yazmayın.
- Veritabanı bağlantı bilgilerini yalnızca server environment variable olarak tutun.
- Admin başlangıç şifresini ilk kurulumdan sonra değiştirmek isterseniz `ADMIN_SEED_PASSWORD` değerini yeni şifreyle ayarlayıp `npm run db:seed` çalıştırabilirsiniz; seed admin hash'ini günceller.
- Production Supabase projesinde database erişimini gereksiz public erişime açmayın.
- Admin endpoint'leri same-origin kontrolü, session kontrolü ve SameSite cookie ile korunur.
- Vercel'de HTTPS otomatik geldiği için `Secure` session cookie production'da aktif olur.

## Son kontrol listesi

- Public menü database'den geliyor.
- Referans logo kullanılıyor; logo oranı bozulmuyor.
- Ana arka plan `#F4EFE6`, ana marka/metin rengi `#5D2A2C`.
- Başlıklar, fiyatlar, navigasyon ve admin başlıklarında Impact font stack'i kullanılıyor.
- Mobil kategori navigasyonu sticky ve yatay kaydırılabilir.
- Aktif kategori IntersectionObserver ile işaretleniyor.
- Kategori ve ürün görünürlüğü ayrı ayrı yönetiliyor.
- Kategori ve ürün drag & drop sıralaması veritabanına kaydoluyor.
- Ürün arama alanı `korean` gibi sorguları açıklama ve ürün adı üzerinde filtreliyor.
- Ürünlerde 0–3 acılık seviyesi tutuluyor ve public menüde emojiye dönüştürülüyor.
- WINGS çoklu fiyat seçeneklerini kullanıyor.
- Kaynakta fiyatı olmayan ürün için seed `NULL` kullanıyor.
- Silme işlemleri özel confirmation modal üzerinden yapılıyor.
- Teknik database hata detayları public kullanıcıya gösterilmiyor.
