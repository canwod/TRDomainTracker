# TRABIS Domain Takip Sistemi

Bu proje, TRABIS (Türkiye Alan Adı Yönetimi) web sitesinden domain verilerini çekerek, kullanıcıların domainleri takip etmesini sağlayan bir web uygulamasıdır.

## Özellikler

- **Domain Arama**: Belirli bir domain adını arayabilirsiniz.
- **Filtreleme**: Domainleri uzantı ve duruma göre filtreleyebilirsiniz.
- **Öncelik Puanı**: Her domain için otomatik olarak hesaplanan öncelik puanı.
- **SEO Metrikleri**: Her domain için detaylı SEO analizi ve puanlaması.
- **Durum Takibi**: Domainlerin durumunu (Aktif, Yakında, Beklemede) gösterir.
- **İstatistikler**: Toplam domain sayısı, aktif domain sayısı, yakında açılacak domain sayısı ve beklemede olan domain sayısı.
- **Toplu Veri Getirme**: "Verileri Getir" butonu ile 50 sayfanın tamamını tek seferde getirebilirsiniz.

## Kurulum

1. Projeyi bilgisayarınıza indirin.
2. XAMPP veya benzeri bir web sunucusu kurun.
3. Projeyi `htdocs` klasörüne kopyalayın.
4. Tarayıcınızdan `http://localhost/TRDomainTracker` adresine gidin.

## Kullanım

1. **Arama**: Üst kısımdaki arama kutusuna domain adını yazın ve Enter tuşuna basın.
2. **Filtreleme**: Uzantı ve durum filtrelerini kullanarak domainleri filtreleyin.
3. **Verileri Getir**: "Verileri Getir" butonuna tıklayarak 50 sayfanın tamamını yükleyin.
4. **İstatistikler**: Sayfanın üst kısmındaki istatistik kartlarını inceleyin.
5. **SEO Analizi**: Her domain için detaylı SEO metriklerini görüntüleyin.

## Domain Öncelik Puanı Hesaplama

Her domain için otomatik olarak hesaplanan öncelik puanı şu kriterlere göre belirlenir:

- **Uzantı Puanı**:
  - .com.tr: 1000 puan
  - .net.tr: 800 puan
  - .org.tr: 600 puan
  - .web.tr: 400 puan

- **SEO Metrikleri**:
  - **Uzunluk Puanı**: Domain uzunluğuna göre 0-100 arası puan
  - **Anahtar Kelime Puanı**: Önemli kelimelerin varlığına göre 0-100 arası puan
  - **Okunabilirlik Puanı**: Tire ve rakam kullanımına göre 0-100 arası puan
  - **Marka Değeri Puanı**: Marka potansiyeline göre 0-100 arası puan

## SEO Metrikleri Detayı

Her domain için hesaplanan SEO metrikleri:

1. **Uzunluk Skoru**:
   - Kısa domainler daha yüksek puan alır
   - Her karakter için 2 puan düşülür

2. **Anahtar Kelime Skoru**:
   - Önemli kelimelerin varlığı (market, shop, store, tech, digital, web, online, turkey, türkiye, istanbul, ankara, izmir)
   - Her kelime için 20 puan eklenir

3. **Okunabilirlik Skoru**:
   - Tire (-) kullanımı puanı düşürür
   - Rakam kullanımı puanı düşürür
   - Her kullanım için 20 puan düşülür

4. **Marka Değeri Skoru**:
   - Tekrar eden harfler puanı düşürür
   - Sessiz-sesli harf düzeni puanı artırır
   - Marka potansiyeli yüksek yapılar puanı artırır

## Domain Durumu

Domainlerin durumu başvuru tarihine göre belirlenir:

- **Aktif**: Başvuru tarihi geçmiş domainler
- **Yakında**: Başvuru tarihine 7 gün veya daha az kalan domainler
- **Beklemede**: Başvuru tarihine 7 günden fazla kalan domainler

## Gereksinimler

- PHP 7.4 veya üzeri
- cURL eklentisi
- DOM eklentisi
- XAMPP veya benzeri web sunucusu

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 
