# Deployment Checklist

- [ ] `.env.local` veya Vercel env içinde `DATABASE_URL` tanımlı
- [ ] `ADMIN_SEED_PASSWORD` yalnızca seed sırasında secret olarak tanımlı
- [ ] `npm run db:migrate` tamamlandı
- [ ] `npm run db:seed` tamamlandı
- [ ] Public `/` açılıyor
- [ ] `/admin` oturumsuzken `/admin/login` sayfasına yönleniyor
- [ ] Admin login çalışıyor
- [ ] Ürün fiyatı değiştiriliyor ve public sayfaya yansıyor
- [ ] Kategori/ürün ekleme-silme çalışıyor
- [ ] Aktif/pasif toggle çalışıyor
- [ ] Drag & drop sıralama refresh sonrası korunuyor
- [ ] WINGS çoklu fiyatları doğru
- [ ] Eksik fiyatlı ürün `0 TL` göstermiyor
- [ ] Production build başarılı
