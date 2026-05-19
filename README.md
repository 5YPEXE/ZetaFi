<div align="center">
  <img src="./public/logo.png" alt="ZetaFi Logo" width="150" />
  <h1>ZetaFi</h1>
  <p><strong>Finansal Özgürlüğe Giden Oyunlaştırılmış Yolculuk</strong></p>

  [![Netlify Status](https://api.netlify.com/api/v1/badges/b7a2d4b9-1d4a-4a6f-9988-51f7fb6ab137/deploy-status)](https://zetafi.netlify.app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

---

## 🚀 Proje Hakkında

**ZetaFi**, gençlerin ve yeni yatırımcıların karmaşık finans dünyasını kolayca anlamasını, bütçelerini yönetmesini ve yapay zeka destekli analizlerle bilinçli yatırım kararları almasını sağlayan **yeni nesil, oyunlaştırılmış bir finansal okuryazarlık ve portföy yönetimi** platformudur.

Geleneksel borsa/finans uygulamalarının karmaşık yapısının aksine ZetaFi; yatırımı, bütçe takibini ve finansal eğitimi eğlenceli bir oyuna dönüştürerek kullanıcı motivasyonunu en üst düzeye çıkarır.

### 🔗 Canlı Demo
**ZetaFi'yi hemen deneyin:** [https://zetafi.netlify.app](https://zetafi.netlify.app)

---

## 💡 Problem ve Çözüm

Günümüzde **finansal okuryazarlık eksikliği**, enflasyon karşısında varlıkları koruyamama ve geleneksel finans ekranlarının yarattığı "bilgi zehirlenmesi" genç yatırımcıların en büyük engelleridir. 

**Çözümümüz:** ZetaFi, **Yapay Zeka (ZetaFi AI)** ve **Oyunlaştırma (Gamification)** dinamiklerini harmanlayarak bu engelleri yıkar. Kullanıcılar bir yandan gerçek zamanlı piyasa verilerini (Kripto, BIST, Emtia) takip ederken, diğer yandan uygulamadaki hedeflere ulaşarak XP (Deneyim Puanı) kazanır ve seviye atlarlar.

---

## 🌟 Öne Çıkan Özellikler

- **🧠 ZetaFi AI (Yapay Zeka Asistanı):** Kullanıcının portföyüne, harcama alışkanlıklarına ve güncel piyasalara bakarak kişiselleştirilmiş stratejiler, risk uyarıları ve eğitimler sunan entegre asistan (Google Gemini gücüyle).
- **🎮 Oyunlaştırma (Gamification):** Makale okumak, bütçeye sadık kalmak ve yatırım yapmak kullanıcıya **XP** ve **Rozetler** kazandırır. "ZetaFi Skorunuz" sizin finansal zekanızı yansıtır.
- **🌍 Tüm Piyasalar Tek Ekranda:** Kripto (CoinGecko), BIST100, Döviz (Forex) ve Emtia (TradingView) verileri tek bir modern ekranda sunulur. Sanal portföy ile risksiz al/sat deneyimi yaşanır.
- **📊 Bütçe & Planlama:** Gelir/gider takibi, Borç Yönetimi ve "Araba Peşinatı", "Acil Durum Fonu" gibi kişisel finansal hedeflerin ilerleme grafikleri.
- **🔐 Güvenli Kimlik Doğrulama:** Supabase altyapısı ile güvenli üyelik ve kişisel veri koruması.

---

## 💻 Teknolojiler ve Mimari

Proje tamamen modern, sunucusuz (serverless) ve ölçeklenebilir bir mimariyle geliştirilmiştir:

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Stil & UI:** Tailwind CSS, Framer Motion (Mikro-animasyonlar), Lucide Icons
- **Backend & Veritabanı:** Supabase (PostgreSQL, Auth), Next.js API Routes
- **Yapay Zeka:** Google Gemini Pro API
- **Veri Kaynakları:** CoinGecko API (Kripto Verileri), TradingView Scanner API (Geleneksel Finans)
- **Deployment:** Netlify

---

## ⚙️ Kurulum ve Lokal Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. **Repoyu Klonlayın:**
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/ZetaFi.git
   cd ZetaFi
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Çevresel Değişkenleri (.env.local) Ayarlayın:**
   Kök dizinde `.env.local` adlı bir dosya oluşturun ve API anahtarlarınızı girin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyebilirsiniz.

---

<div align="center">
  <p><i>Finansal zekanı geliştir, geleceğini yönet!</i></p>
</div>
