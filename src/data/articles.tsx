import { BookOpen, TrendingUp, Bitcoin, ShieldCheck } from "lucide-react";
import React from "react";

export type Article = {
  title: string;
  source: string;
  readTime: string;
  content: string;
};

export type Category = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  articles: Article[];
};

export const articleCategories: Category[] = [
  {
    id: "temel-finans",
    title: "Temel Finans & Ekonomi",
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    description: "Para yönetimi, enflasyon, faiz ve temel ekonomik kavramları öğrenin.",
    articles: [
      { 
        title: "Enflasyon Nedir, Nasıl Korunulur?", 
        source: "ZetaFi Akademi", readTime: "8 dk", 
        content: `### 📌 Yönetici Özeti (Executive Summary)
Enflasyon, en temel tanımıyla mal ve hizmetlerin fiyatlarının genel düzeyindeki sürekli ve istikrarlı artıştır. Enflasyon oranının artması, elinizdeki paranın alım gücünün düştüğünü gösterir. Dün 100 TL'ye alabildiğiniz bir sepet dolusu ürünü, bugün aynı paraya alamıyorsanız, enflasyonun sessiz vergilendirmesi altındasınız demektir. Enflasyondan korunmanın tek yolu nakitte kalmamak ve enflasyon oranından daha yüksek getiri sağlayan (reel getiri) varlıklara (hisse senedi, emtia, gayrimenkul) yatırım yapmaktır.

---

### ⚙️ Teknik Detaylar ve Analiz

#### 1. Enflasyonun Temel Nedenleri (Makroekonomik Bakış)
Enflasyon genellikle üç ana makroekonomik sebepten kaynaklanır:

**A. Talep Enflasyonu (Demand-Pull Inflation):**
Ekonomideki toplam talebin, mevcut mal ve hizmet arzını aşması durumudur. "Çok fazla paranın, çok az malı kovalaması" olarak özetlenebilir. Tüketicilerin elinde bol miktarda nakit veya kolay erişilebilir kredi olduğunda harcamalar artar. Üreticiler kapasitelerini aynı hızda artıramazsa, mevcut ürünlerin fiyatları hızla tırmanır.

**B. Maliyet Enflasyonu (Cost-Push Inflation):**
Üretim faktörlerinin (enerji, hammadde, işçilik) maliyetlerindeki ani artışların tüketici fiyatlarına yansımasıdır. Örneğin küresel petrol fiyatlarının aniden artması, ulaşım ve lojistik maliyetlerini artırır; bu da raflardaki her ürünün zamlanmasına neden olur.

**C. Parasal Enflasyon (Monetary Inflation):**
Merkez bankalarının (örn: FED, ECB, TCMB) piyasaya, ekonomik büyümeden daha hızlı bir şekilde karşılıksız para sürmesi (para basması) sonucu oluşur. Bir ürünün (bu durumda paranın) arzı artarsa, değeri düşer. Bu durum genellikle devalüasyon (yerel para biriminin döviz karşısında değer kaybetmesi) ile sonuçlanır.

#### 2. Fisher Etkisi ve Reel Getiri Hesaplaması
Enflasyonist ortamlarda yatırımlarınızı değerlendirirken "Nominal Getiri" (gördüğünüz getiri) ile "Reel Getiri" (gerçekleşen alım gücü artışı) arasındaki farkı çok iyi anlamalısınız. Irving Fisher'ın denklemine göre:

**Reel Faiz Oranı ≈ Nominal Faiz Oranı - Enflasyon Oranı**

*Örnek Senaryo:*
Bankanız size yıllık %40 faiz veriyor (Nominal Getiri). Ancak yıllık enflasyon oranı %60 ise:
Reel Getiri = %40 - %60 = **-%20**
Yani paranız nominal olarak artsa da, gerçekte alım gücünüz %20 erimiştir. Bu duruma finans literatüründe **negatif reel faiz** denir.

#### 3. Kurumsal Korunma Stratejileri (Hedging)
Enflasyon dönemlerinde portföyü korumak için uygulanan stratejiler:

*   **Hisse Senetleri (Equities):** Şirketler, artan maliyetlerini doğrudan ürün fiyatlarına yansıtabilme (pricing power) gücüne sahiptir. Özellikle gıda, enerji ve sağlık gibi "defansif" sektör hisseleri, enflasyona karşı mükemmel koruma sağlar.
*   **Gayrimenkul ve GYO:** Konut ve ticari mülkler hem fiziksel bir varlık oldukları için değer kazanır, hem de kira gelirleri enflasyonla orantılı olarak artış gösterir.
*   **TÜFE'ye Endeksli Tahviller (TIPS):** Devletler tarafından ihraç edilen ve getirisi doğrudan gerçekleşen enflasyon oranına bağlanan güvenli liman araçlarıdır.
*   **Emtialar (Altın, Gümüş, Petrol):** İtibari paraların (fiat currency) aksine sınırlı arza sahip oldukları için kriz ve yüksek enflasyon dönemlerinde güvenli liman (safe haven) olarak talep görürler.
*   **Bitcoin (Dijital Altın):** Geleneksel finansın dışında, kodla sabitlenmiş 21 milyonluk maksimum arzı sayesinde, uzun vadede merkez bankalarının para basma politikalarına karşı bir "hedge" (korunma) aracı olarak görülmektedir.

**Sonuç:** Enflasyon, finansal okuryazarlığı olmayan kitlelerin servetini, doğru pozisyon almış yatırımcılara transfer eden sessiz bir mekanizmadır. Nakit para bir yatırım aracı değil, sadece bir işlem aracıdır.`
      },
      { 
        title: "Bileşik Faiz: Dünyanın 8. Harikası", 
        source: "ZetaFi Akademi", readTime: "7 dk", 
        content: `### 📌 Yönetici Özeti (Executive Summary)
Bileşik faiz, basitçe anaparanın getirdiği faizin (veya kârın) de faiz kazanması prensibidir. Albert Einstein'a atfedilen "Dünyanın 8. harikası" sözüyle ünlenmiştir. Düzenli yatırımların uzun vadede katlanarak (eksponansiyel) büyümesini sağlayan yegane matematiksel formüldür. Kısa vadede etkisi gözle görülmese de, yatırım vadesi 10 yılı aştığında portföy büyüklüğünü adeta bir çığ gibi büyütür. Temel kural; elde edilen kazançların harcanmayıp, tekrar sisteme yatırılmasıdır (Re-investing).

---

### ⚙️ Teknik Detaylar ve Analiz

#### 1. Basit Faiz ve Bileşik Faiz Arasındaki Fark
Finansal matematiğin en temel kuralı bu iki kavramın farkını bilmektir:
- **Basit Faiz:** Sadece ilk yatırılan anapara üzerinden kâr hesaplanır. (Doğrusal büyüme)
- **Bileşik Faiz:** Her dönem elde edilen kâr anaparaya eklenir ve bir sonraki dönem yeni toplam tutar üzerinden kâr hesaplanır. (Geometrik / Eksponansiyel büyüme)

#### 2. Bileşik Faizin Matematiksel Formülü
Gelecekteki Değer (FV) şu formülle hesaplanır:
**FV = P * (1 + r/n)^(n*t)**

*Değişkenler:*
- **FV (Future Value):** Gelecekteki toplam bakiye.
- **P (Principal):** Başlangıç anaparası.
- **r (Rate):** Yıllık nominal faiz (veya getiri) oranı (ondalık cinsinden).
- **n:** Bir yılda faizin kaç kez birleşeceği (aylık ise 12, günlük ise 365).
- **t (Time):** Paranın yatırıldığı yıl sayısı.

*Analiz:* Formülde dikkatinizi çeken en önemli kısım **(t)** yani zaman değişkeninin **üs** olarak yer almasıdır. Faiz oranı (r) yatay bir etki yaratırken, zaman (t) üstel bir etki yaratır. Bu yüzden bileşik faizde **en erken başlayan, en çok kazanır.**

#### 3. 72 Kuralı (Rule of 72)
Portföy yöneticilerinin anında hesaplama yapmak için kullandığı pratik bir finansal kuraldır. Bir yatırımın değerinin ne kadar sürede **iki katına** çıkacağını bulmak için kullanılır.

**Formül:** 72 / Yıllık Getiri Oranı = İki Katına Çıkma Süresi (Yıl)

*Örnek:* Yıllık %8 ortalama net getiri sağlayan bir endeks fonuna yatırım yaptınız.
72 / 8 = **9 Yıl**. (Paranız her 9 yılda bir ikiye katlanacaktır).

#### 4. Kümülatif Etki (Kartopu Etkisi) Simülasyonu
İki farklı yatırımcı düşünelim:
- **Yatırımcı A:** 20 yaşında yatırıma başlar. Her ay 100$ yatırır. 30 yaşında yatırımı tamamen bırakır (Sadece 10 yıl para yatırır).
- **Yatırımcı B:** 30 yaşında yatırıma başlar. Her ay 100$ yatırır ve 60 yaşına kadar devam eder (Tam 30 yıl para yatırır).

İkisi de yıllık %10 getiri elde ettiğinde; 60 yaşına geldiklerinde **Yatırımcı A**, sadece 10 yıl para yatırmış olmasına rağmen, sistemde daha uzun süre kaldığı (parası 40 yıl boyunca bileşiklendiği) için Yatırımcı B'den **çok daha zengin** olacaktır.

**Sonuç:** Finansal piyasalarda zamanlama (timing the market) değil, **piyasada geçirilen zaman (time in the market)** zenginliği yaratan ana faktördür.`
      },
      { 
        title: "Ayı ve Boğa Piyasası Kavramları", 
        source: "ZetaFi Akademi", readTime: "3 dk", 
        content: `### Boğa Piyasası (Bull Market)\nPiyasaların iyimser olduğu, fiyatların sürekli yükseldiği ve yatırımcı güveninin zirvede olduğu dönemlerdir. Boğaların boynuzlarını aşağıdan yukarıya doğru vurarak saldırmalarından ilham alınmıştır.\n\n### Ayı Piyasası (Bear Market)\nFiyatların zirveden en az %20 düştüğü, kötümserliğin hakim olduğu dönemlerdir. Ayıların pençelerini yukarıdan aşağıya doğru savurmalarından ilham alınmıştır.\n\n### Yatırımcı Psikolojisi\n- **Boğa Piyasasında:** Herkes dâhidir. Fiyatlar ne kadar yükselirse yükselsin, daha da yükseleceğine inanılır (FOMO - Fırsatı Kaçırma Korkusu).\n- **Ayı Piyasasında:** Herkes umutsuzdur. Varlıkların değerleri gerçek değerlerinin çok altına düşebilir.\n\nAkıllı yatırımcılar ayı piyasasında ucuza toplar, boğa piyasasında ise kâr realizasyonu (satış) yaparlar.`
      },
      { 
        title: "Merkez Bankası Faiz Kararları Piyasayı Nasıl Etkiler?", 
        source: "ZetaFi Akademi", readTime: "4 dk", 
        content: `### Faiz Oranı Nedir?\nFaiz, paranın kirasıdır. Merkez bankaları (örneğin FED veya TCMB), ekonomideki para miktarını ve enflasyonu kontrol etmek için faiz oranlarını bir silah olarak kullanır.\n\n### Faiz Artırımı (Şahin Politika)\n- **Amaç:** Enflasyonu düşürmek ve ekonomiyi soğutmak.\n- **Etkisi:** Borçlanma maliyetleri artar. İnsanlar ve şirketler harcamak yerine paralarını bankada faizde tutmayı tercih eder.\n- **Piyasalara Etkisi:** Nakit paranın getirisi garanti olduğu için yatırımcılar riskli varlıklardan (Borsa, Kripto) kaçar. Bu nedenle faiz artırımlarında genellikle borsa ve kripto piyasaları düşüş eğilimi gösterir.\n\n### Faiz İndirimi (Güvercin Politika)\n- **Amaç:** Ekonomiyi canlandırmak, büyümeyi teşvik etmek.\n- **Etkisi:** Borçlanmak ucuzlar. İnsanlar kredi çekip ev, araba alır; şirketler yatırım yapar.\n- **Piyasalara Etkisi:** Bankada paranın getirisi düşük olduğunda yatırımcılar getiri arayışına girer. Borsa, altın ve kripto para piyasalarında yükseliş (ralli) görülür.`
      }
    ]
  },
  {
    id: "kisisel-finans",
    title: "Kişisel Finans & Bütçe",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    description: "Kişisel bütçenizi yönetme, tasarruf stratejileri ve 50/30/20 kuralı.",
    articles: [
      { 
        title: "50/30/20 Bütçe Kuralı Nasıl Uygulanır?", 
        source: "ZetaFi Akademi", readTime: "6 dk", 
        content: `### 📌 Yönetici Özeti (Executive Summary)
50/30/20 kuralı, ilk olarak ABD'li Senatör Elizabeth Warren tarafından "All Your Worth" kitabında popülerleştirilen, dünyanın en basit ve en etkili kişisel bütçeleme sistemlerinden biridir. Karmaşık elektronik tablolar ve harcama takipleri yerine, vergi sonrası net gelirinizi sadece üç ana kategoriye ayırmayı önerir: %50 Zorunlu İhtiyaçlar, %30 Kişisel İstekler ve %20 Tasarruf/Yatırım. Bu sistem, hem geleceğinizi güvence altına almanızı hem de suçluluk duymadan paranızı harcayabilmenizi sağlayan psikolojik bir denge kurar.

---

### ⚙️ Teknik Detaylar ve Analiz

#### 1. Kategorilerin Teknik Dağılımı

**A. %50 - Sabit İhtiyaçlar (Needs):**
Bunlar hayatta kalmanız ve temel işlevlerinizi sürdürebilmeniz için **kesinlikle** yapmanız gereken harcamalardır. Eğer işinizi kaybederseniz bile ödemek zorunda olduğunuz kalemlerdir.
- Kira veya konut kredisi taksitleri
- Temel mutfak alışverişi (market)
- Sabit faturalar (Elektrik, Su, Doğalgaz, İnternet)
- Temel sağlık ve sigorta primleri
- Minimum borç/kredi kartı asgari ödemeleri
*(Kural: Eğer ihtiyaçlarınız %50'yi aşıyorsa, yaşam standardınızı (örneğin daha ucuz bir eve taşınmak) veya gelir seviyenizi acilen revize etmeniz gerekir).*

**B. %30 - İstekler ve Yaşam Tarzı (Wants):**
Hayattan keyif almanızı sağlayan, ancak olmadığında hayatta kalmanızı tehlikeye atmayan harcamalardır. Bütçe yaparken insanların en çok hata yaptığı yer, istekleri tamamen kesmektir; bu sürdürülemez bir diyete benzer.
- Dışarıda yenen yemekler, kafeler
- Tatiller, konser biletleri, hobiler
- Yeni kıyafetler (temel gereksinim ötesi)
- Netflix, Spotify vb. abonelikler
*(Not: Herhangi bir "İstek" harcaması yaparken bütçenizin bu %30'luk diliminden harcadığınızı bilirseniz, finansal suçluluk duymazsınız).*

**C. %20 - Finansal Gelecek (Savings/Investments):**
Bu dilim, gelecekteki "Siz" için ödediğiniz maaştır. Maaş yattığında harcama yapmadan önce **ilk kesilmesi gereken** kısımdır (Pay yourself first kuralı).
- Acil durum fonu oluşturmak
- Borsa, kripto veya emtia portföyüne yatırım yapmak
- Bireysel Emeklilik (BES) kesintileri
- Yüksek faizli borçları (asgari tutarın ötesinde) hızlıca kapatmak için yapılan ekstra ödemeler.

#### 2. Kuralın Otomatizasyonu (Behavioral Finance)
Davranışsal finans (Behavioral Finance), insanların iradesinin zayıf olduğunu kanıtlamıştır. 50/30/20 kuralını uygulamak için manuel para transferi yapmak yerine sistemleri otomatize etmelisiniz:
- Maaş yattığı gün, banka hesabınızdan otomatik virman talimatı vererek %20'yi yatırım hesabınıza (veya ayrı bir tasarruf hesabına) gönderin.
- Gözden ırak olan, gönülden de ırak olur. Yatırıma giden o %20'yi hiç kazanmamış gibi yaşamaya alışırsanız, servet birikiminiz kendiliğinden gerçekleşir.

**Sonuç:** 50/30/20 kuralı katı bir yasa değil, bir "pusuladır". Geliriniz çok düşükse %50 ihtiyaçlara yetmeyebilir; bu durumda oranları (örneğin 60/20/20) olarak hayatınıza uyarlayabilirsiniz.`
      },
      { 
        title: "Acil Durum Fonu Neden Hayatidir?", 
        source: "ZetaFi Akademi", readTime: "2 dk", 
        content: `### Acil Durum Fonu Nedir?\nAcil durum fonu, ani işsizlik, beklenmedik sağlık sorunları, acil ev/araç tamiratı gibi beklenmedik kriz anları için bir kenara ayrılmış nakit paraktır.\n\n### Ne Kadar Olmalı?\nFinansal uzmanlar, acil durum fonunun en az **3 ila 6 aylık zorunlu giderlerinizi** karşılayacak büyüklükte olması gerektiğini savunur.\n\n### Altın Kurallar\n1. **Likidite:** Bu para anında nakde çevrilebilir olmalıdır. Vadesiz hesapta veya günlük faiz veren hesaplarda tutulmalıdır.\n2. **Risk Alınmaz:** Acil durum fonu kriptoda veya hisse senedinde tutulmaz. Piyasa çöktüğünde o paraya acil ihtiyacınız olabilir.\n3. **Amacı Dışında Kullanılmaz:** Tatil veya yeni bir telefon almak için bu fona dokunulmaz.\n\nAcil durum fonu sadece bir finansal araç değil, aynı zamanda geceleri rahat uyumanızı sağlayan psikolojik bir kalkandır.`
      },
      { 
        title: "Borç Kartopu Yöntemiyle Borçlardan Kurtulmak", 
        source: "ZetaFi Akademi", readTime: "4 dk", 
        content: `### Kartopu Yöntemi (Snowball Method)\nFinansal uzman Dave Ramsey tarafından popülerleştirilen bu yöntem, borç ödemeye matematiksel değil **psikolojik** bir yaklaşım sunar.\n\n### Nasıl Uygulanır?\n1. Sahip olduğunuz tüm borçları (kredi kartları, ihtiyaç kredileri vb.) **en küçükten en büyüğe doğru** sıralayın (faiz oranlarına bakmaksızın).\n2. Tüm borçlarınız için sadece zorunlu asgari ödemeleri (minimum tutarları) yapın.\n3. Elinizde kalan tüm ekstra nakdi **en küçük borcu** kapatmak için kullanın.\n4. En küçük borç kapandığında, o borca ayırdığınız parayı bir sonraki en küçük borcun ödemesine ekleyin.\n\n### Neden İşe Yarıyor?\nMatematiksel olarak en yüksek faizli borcu önce kapatmak daha mantıklı görünse de, insan psikolojisi "küçük zaferlere" ihtiyaç duyar. Küçük bir borcu tamamen kapatmak, size motivasyon sağlar ve süreci devam ettirmeniz için gereken momentumu (kartopu etkisini) yaratır.`
      },
      { 
        title: "Erken Emeklilik (FIRE) Hareketi Nedir?", 
        source: "ZetaFi Akademi", readTime: "5 dk", 
        content: `### FIRE Nedir?\n**F**inancial **I**ndependence, **R**etire **E**arly (Finansal Bağımsızlık, Erken Emeklilik). Geleneksel olarak 65 yaşında emekli olmak yerine, 30'lu veya 40'lı yaşlarda finansal özgürlüğe ulaşmayı hedefleyen küresel bir harekettir.\n\n### Temel Prensipleri\n1. **Agresif Tasarruf:** Gelirin %50 ila %70'ini tasarruf etmek. Bunun için minimalist bir yaşam tarzı benimsenir.\n2. **Sürekli Yatırım:** Biriken para, pasif gelir üreten temettü hisselerine, fonlara veya gayrimenkule yatırılır.\n3. **%4 Kuralı (Trinity Çalışması):** Yatırım portföyünüzün büyüklüğü, yıllık harcamalarınızın 25 katına ulaştığında finansal bağımsızsınız demektir. Portföyünüzden her yıl en fazla %4 çekerek, ana paranızı hiç eritmeden sonsuza kadar yaşayabilirsiniz.\n\n### Kimler İçin Uygun?\nAşırı tüketimden yorulmuş, zamanını bir ofiste geçirmek yerine dünyayı gezmek, ailesine vakit ayırmak veya sevdiği işleri (para kaygısı olmadan) yapmak isteyen herkes için uygundur.`
      }
    ]
  },
  {
    id: "borsa-yatirim",
    title: "Borsa & Yatırım Stratejileri",
    icon: <TrendingUp className="w-6 h-6 text-rose-500" />,
    description: "Hisse senedi analizi, portföy çeşitlendirmesi ve risk yönetimi.",
    articles: [
      { 
        title: "Temel ve Teknik Analiz Arasındaki Farklar", 
        source: "ZetaFi Akademi", readTime: "6 dk", 
        content: `### 📌 Yönetici Özeti (Executive Summary)
Finansal piyasalarda işlem yaparken yatırımcıların karar vermek için kullandığı iki ana metodoloji vardır: Temel Analiz (Fundamental Analysis) ve Teknik Analiz (Technical Analysis). Temel analiz, bir şirketin veya varlığın ekonomik, finansal ve sektörel verilerini inceleyerek "gerçek değerini" bulmaya çalışır. Teknik analiz ise sadece varlığın geçmiş fiyat hareketlerine ve işlem hacmine (grafiklere) odaklanarak "piyasa psikolojisini" ve fiyatın gelecekteki olası yönünü tahmin eder. Başarılı profesyoneller, "Neyi satın almalıyım?" sorusu için temel analizi, "Ne zaman satın almalıyım?" sorusu için ise teknik analizi kullanırlar.

---

### ⚙️ Teknik Detaylar ve Analiz

#### 1. Temel Analiz (Fundamental Analysis)
Bir varlığın içsel (gerçek) değerini hesaplamaya dayanır. Piyasaların bazen aşırı iyimser (balon) veya aşırı kötümser olabileceğini, ancak uzun vadede fiyatın her zaman "gerçek değerine" döneceğini savunur.

**Kullanılan Metrikler ve Araçlar:**
*   **Makroekonomik Veriler:** Faiz oranları, GSYH büyümesi, enflasyon, merkez bankası politikaları.
*   **Finansal Tablolar (Bilanço & Gelir Tablosu):** Şirketin kârlılığı, borç/özkaynak oranı, nakit akışı.
*   **F/K (Fiyat/Kazanç) Oranı:** Şirketin piyasa değerinin yıllık kârına oranı. Şirketin kazancına kıyasla pahalı mı yoksa ucuz mu fiyatlandığını gösterir.
*   **PD/DD (Piyasa Değeri / Defter Değeri):** Şirketin hisse fiyatı ile muhasebe değeri arasındaki ilişki.
*   **Nitel Faktörler:** CEO'nun vizyonu, yönetim kalitesi, sektörel rekabet gücü (Moat) ve yasal regülasyonlar.

*Uygulama Alanı:* Warren Buffett gibi "Değer Yatırımcıları", hisseleri yıllarca veya on yıllarca elde tutmak için temel analiz yaparlar.

#### 2. Teknik Analiz (Technical Analysis)
Grafiklerin ve matematiksel göstergelerin bilimidir. Varlığın "ne olduğu" ile ilgilenmez (bilançolara bakmaz); tamamen arz ve talebin fiyat üzerindeki etkisini ölçer.

**Temel Varsayımları:**
1. Piyasadaki tüm bilgiler (temel veriler dahil) fiyatın içine zaten yansımıştır (Market discounts everything).
2. Fiyatlar trendler halinde (yukarı, aşağı veya yatay) hareket eder.
3. Tarih tekerrür eder (İnsan psikolojisi değişmediği için geçmiş formasyonlar gelecekte de çalışır).

**Kullanılan Metrikler ve Araçlar:**
*   **Mum Grafikleri (Candlesticks):** Açılış, kapanış, en yüksek ve en düşük fiyatları görselleştirir.
*   **Destek ve Direnç Seviyeleri:** Fiyatın tarihsel olarak tepki verdiği, alıcıların (destek) veya satıcıların (direnç) yoğunlaştığı psikolojik fiyat bölgeleri.
*   **Hareketli Ortalamalar (SMA, EMA):** Fiyat dalgalanmalarını pürüzsüzleştirerek trendin yönünü gösterir (Örn: 50 günlük veya 200 günlük ortalamalar).
*   **İndikatörler (RSI, MACD, Bollinger Bantları):** Piyasanın aşırı alım (overbought) veya aşırı satım (oversold) bölgelerinde olup olmadığını ölçen momentum göstergeleri.

*Uygulama Alanı:* "Traderlar" (Al-Sat yapanlar) gün içi (Day Trading), haftalık (Swing Trading) veya trend takibi işlemleri için teknik analiz kullanırlar.

**Sonuç:** Bu iki yöntem birbirine düşman değildir. Gerçek bir profesyonel, temel analiz ile "sağlam ve büyüyen bir şirket" bulur; ardından teknik analiz ile bu şirketi "en doğru (ucuz) fiyattan" almak için grafik üzerinde destek seviyesinin test edilmesini bekler.`
      },
      { 
        title: "Portföy Çeşitlendirmesi (Diversifikasyon)", 
        source: "ZetaFi Akademi", readTime: "3 dk", 
        content: `### Bütün Yumurtaları Aynı Sepete Koymamak\nYatırım dünyasının altın kuralıdır. Çeşitlendirme, sermayenizi farklı varlık sınıflarına, farklı sektörlere ve farklı coğrafyalara bölerek riski minimize etme sanatıdır.\n\n### Neden Gereklidir?\n- **Risk Düşüşü:** Teknoloji sektörü çakıldığında, gıda sektörü yatırımlarınız portföyünüzü ayakta tutabilir.\n- **Daha Stabil Getiri:** Varlıkların hepsi aynı anda hareket etmez (korelasyon). Altın düşerken hisse senetleri yükselebilir.\n\n### Nasıl Çeşitlendirilir?\n1. **Varlık Sınıfları Arası:** Sadece hisse senedi değil; altın, kripto ve tahvil gibi zıt hareket edebilen araçları dahil edin.\n2. **Sektörel:** Tüm hisseleriniz bankacılık sektöründen olmasın; sağlık, teknoloji ve sanayiye bölün.\n3. **Coğrafi:** Sadece lokal borsaya (BIST) değil, global fonlara da (S&P 500) yatırım yaparak ülke riskini dağıtın.`
      },
      { 
        title: "Warren Buffett'ın Değer Yatırımı Stratejisi", 
        source: "ZetaFi Akademi", readTime: "5 dk", 
        content: `### Değer Yatırımı (Value Investing) Nedir?\nDünyanın en başarılı yatırımcısı kabul edilen Warren Buffett'ın ustası Benjamin Graham'dan öğrendiği stratejidir. Özü şudur: Piyasada anlık panikler veya geçici krizler nedeniyle **gerçek değerinin çok altında (iskontolu) fiyatlanan** sağlam şirketleri bulup satın almak.\n\n### Buffett'ın 4 Temel Kuralı\n1. **Anladığınız İşe Yatırım Yapın:** Faaliyet modelini anlamadığınız bir teknoloji şirketine, sadece herkes konuşuyor diye ortak olmayın (Buffett uzun süre dot-com balonundan uzak durmuştur).\n2. **Rekabet Avantajı (Ekonomik Hendek - Moat):** Güçlü bir markaya (örn: Coca-Cola), düşük üretim maliyetine (örn: Walmart) veya eşsiz bir teknolojiye sahip, rakiplerin kolayca kopyalayamayacağı şirketleri seçin.\n3. **Mükemmel Yönetim:** Dürüst, hissedar dostu (temettü ödeyen) ve yetenekli bir CEO'su olan şirketleri arayın.\n4. **Güvenlik Marjı:** Şirketin içsel değeri 100 TL ise, onu 70 TL'ye (veya daha ucuza) almayı bekleyin. Aradaki 30 TL'lik fark sizin "Güvenlik Marjınızdır". Eğer hesaplamanızda yanıldıysanız bile zarar etmenizi önler.\n\n*"Başkaları açgözlü olduğunda korkak ol, başkaları korkak olduğunda açgözlü ol." - Warren Buffett*`
      },
      { 
        title: "Temettü Yatırımcılığı ve Pasif Gelir", 
        source: "ZetaFi Akademi", readTime: "4 dk", 
        content: `### Temettü Nedir?\nBir şirketin yıl boyunca elde ettiği net kârın bir kısmını (veya tamamını) pay sahiplerine (hissedarlarına) nakit olarak dağıtmasıdır. Şirkete "ortak" olduğunuz için ticari kazançtan payınıza düşeni alırsınız.\n\n### Temettü Emekliliği Nasıl Çalışır?\nFiyatı sürekli inip çıkan hisse senetlerini "al-sat" yapmak yerine, her yıl düzenli olarak kâr payı dağıtan köklü şirketlerin hisselerini (örn: Ford, Tüpraş, Coca-Cola, Ereğli) "al-tut" mantığıyla biriktirmektir.\n\n1. Hisse senedi sayınızı her ay artırırsınız.\n2. Yıl sonunda veya çeyreklik dönemlerde hesabınıza nakit temettü yatar.\n3. Gelen bu nakit temettü ile **tekrar aynı hisseden satın alırsınız** (Bileşik Faiz etkisi).\n4. Yıllar sonra portföyünüz o kadar büyür ki, şirketlerden gelen yıllık temettü ödemeleri, sizin tüm yıllık yaşam masraflarınızı karşılar hale gelir.\n\n### Avantajı\nPiyasa dursa bile, şirket çalışıp kâr ettiği sürece nakit akışınız devam eder.`
      }
    ]
  },
  {
    id: "kripto-web3",
    title: "Kripto Paralar & Web3",
    icon: <Bitcoin className="w-6 h-6 text-amber-500" />,
    description: "Blockchain teknolojisi, Bitcoin, altcoinler ve merkeziyetsiz finans.",
    articles: [
      { 
        title: "Blockchain Teknolojisi Nasıl Çalışır?", 
        source: "ZetaFi Akademi", readTime: "4 dk", 
        content: `### Blokzincir (Blockchain) Nedir?\nBlockchain, bilgilerin tek bir merkezi sunucuda (örneğin bir bankanın veritabanı) değil, dünya çapında binlerce bilgisayara (node) dağıtılmış bir şekilde tutulduğu dijital bir defterdir.\n\n### Nasıl İşler?\n1. **İşlem Talebi:** Bir kullanıcı para göndermek ister.\n2. **Doğrulama:** Ağdaki bilgisayarlar karmaşık matematiksel algoritmalar çözerek işlemin geçerliliğini doğrular.\n3. **Blok Oluşumu:** Doğrulanan işlemler bir araya getirilerek bir "Blok" oluşturulur.\n4. **Zincire Eklenme:** Yeni blok, değiştirilemez ve kriptografik bir şifre (Hash) ile bir önceki bloğa zincirlenir.\n5. **Tamamlanma:** İşlem kalıcı olarak kaydedilir ve geriye dönük asla değiştirilemez.\n\n### Önemi Nedir?\nAracıları (bankalar, noterler, devletler) ortadan kaldırır. Sistemi şeffaf, güvenilir ve sansürlenemez hale getirir.`
      },
      { 
        title: "Soğuk Cüzdan vs Sıcak Cüzdan", 
        source: "ZetaFi Akademi", readTime: "3 dk", 
        content: `### Sıcak Cüzdan (Hot Wallet)\nİnternete bağlı olan kripto cüzdanlarıdır. Borsalardaki (Binance, BtcTurk) hesaplarınız veya tarayıcı eklentileri (MetaMask) sıcak cüzdandır.\n- **Avantajı:** Hızlı al-sat yapmak, Web3 uygulamalarına bağlanmak için son derece pratik ve kolaydır.\n- **Dezavantajı:** İnternete bağlı oldukları için hacklenme, oltalama (phishing) veya borsa iflası risklerine açıktır.\n\n### Soğuk Cüzdan (Cold Wallet)\nİnternet bağlantısı olmayan, genellikle USB belleğe benzeyen fiziksel donanım cihazlarıdır (Ledger, Trezor vb.).\n- **Avantajı:** Özel anahtarlarınız (Private Keys) çevrimdışı tutulduğu için hackerların uzaktan erişimi imkansızdır. Kripto varlıkları saklamanın en güvenli yoludur.\n- **Dezavantajı:** Kullanımı sıcak cüzdanlar kadar pratik değildir. Cihazı fiziksel olarak korumanız ve kurtarma kelimelerinizi (Seed Phrase) çok iyi saklamanız gerekir.\n\n**Altın Kural:** "Not your keys, not your coins." (Anahtarlar senin değilse, coinler de senin değildir). Uzun vadeli büyük yatırımlar her zaman soğuk cüzdanda tutulmalıdır.`
      },
      { 
        title: "DeFi (Merkeziyetsiz Finans) Nedir?", 
        source: "ZetaFi Akademi", readTime: "7 dk", 
        content: `### 📌 Yönetici Özeti (Executive Summary)
DeFi (Decentralized Finance), bankalar, aracı kurumlar, noterler veya sigorta şirketleri gibi geleneksel finansal aracılara ihtiyaç duymadan; tamamen blokzincir (genellikle Ethereum) üzerinde çalışan akıllı sözleşmeler (Smart Contracts) aracılığıyla inşa edilmiş açık, küresel ve şeffaf bir finansal ekosistemdir. Kullanıcılar bir bankaya gitmeden saniyeler içinde kredi çekebilir, faiz kazanabilir veya kripto paralarını takas edebilirler. Geleneksel finanstaki (CeFi) kimlik zorunlulukları (KYC) ve çalışma saatleri kısıtlamaları DeFi'de yoktur; sistem 7/24/365 açıktır.

---

### ⚙️ Teknik Detaylar ve Analiz

#### 1. DeFi'nin Temel Yapı Taşları
DeFi'nin işleyebilmesi için üç ana bileşene ihtiyaç vardır:
*   **Blokzincir Ağları (Layer 1):** Uygulamaların üzerinde çalıştığı, güvenliği ve şeffaflığı sağlayan temel katman (Ethereum, Solana, Avalanche).
*   **Akıllı Sözleşmeler (Smart Contracts):** Belirli koşullar sağlandığında (Örn: "A cüzdanı B cüzdanına 100 USDT gönderdiğinde, 1 ETH'yi otomatik serbest bırak") insan müdahalesi olmadan otomatik olarak çalışan kod parçacıklarıdır.
*   **Merkeziyetsiz Uygulamalar (dApps):** Akıllı sözleşmelerin kullanıcı arayüzüne dökülmüş halidir. Web tarayıcınızdan MetaMask gibi bir Web3 cüzdanı bağlayarak dApp'leri kullanırsınız.

#### 2. Geleneksel Finans (TradFi) ile DeFi Karşılaştırması

| Özellik | Geleneksel Finans (Banka) | Merkeziyetsiz Finans (DeFi) |
| :--- | :--- | :--- |
| **Erişilebilirlik** | Kredi notu, kimlik, ikametgah gerekir. | Sadece bir internet bağlantısı ve cüzdan yeterlidir. |
| **Kontrol (Saklama)** | Paranızı banka tutar, dondurabilir veya bloke edebilir. | Özel anahtarlarınız (Private Keys) sizdedir (Non-custodial). Kimse paranıza el koyamaz. |
| **Şeffaflık** | Kapalı kapılar ardında işlemler yapılır. Bilançolar aylarca gizli kalabilir. | Tüm kodlar açık kaynaktır. Her işlem, havuzdaki miktar herkes tarafından saniyeler içinde denetlenebilir. |
| **Hız ve Saatler** | EFT/Havale saatleri, tatil günleri, uluslararası SWIFT günleri sürer. | Resmi tatil yoktur, 7/24 çalışır. Uluslararası transfer saniyeler içinde gerçekleşir. |

#### 3. Ana DeFi Kullanım Durumları (Protokoller)

**A. Merkeziyetsiz Borsalar (DEX'ler - Örn: Uniswap):**
Binance gibi merkezi borsaların aksine, DEX'lerde bir şirket veya emir defteri (order book) yoktur. "Otomatik Piyasa Yapıcı" (AMM - Automated Market Maker) adı verilen algoritmalar sayesinde, kullanıcılar likidite havuzları üzerinden cüzdandan cüzdana (P2P) direkt takas yaparlar.

**B. Borç Alma ve Verme Protokolleri (Lending - Örn: Aave, MakerDAO):**
Banka kredi departmanı yerine bir koda paranızı yatırıp anında faiz kazanabilir, ya da elinizdeki Bitcoin'i teminat (collateral) göstererek kontrattan nakit (Stablecoin) kredi çekebilirsiniz. Kod, teminatınızın değeri düşerse otomatik olarak tasfiye (liquidation) işlemi yapar, bu sayede sistem batmaz.

#### 4. DeFi'nin Teknik ve Sistematik Riskleri
Her ne kadar devrimsel olsa da, DeFi yüksek riskler taşır:
*   **Akıllı Kontrat Riski (Smart Contract Hack):** Kodlarda bir yazılım açığı (bug) varsa, hackerlar saniyeler içinde havuzdaki milyonlarca doları boşaltabilir. Kodu onaylayan veya geri alan bir merci yoktur.
*   **Geçici Kayıp (Impermanent Loss):** DEX'lerde likidite sağlayıcısı olduğunuzda, kripto paraların fiyatlarındaki sert dalgalanmalar nedeniyle, parayı havuzda tutmanın sadece cüzdanda tutmaya kıyasla daha zararlı olabileceği matematiksel bir durumdur.
*   **Düzenleme ve Regülasyon (Regulatory Risks):** Devletler merkeziyetsiz borsaları yasaklamaya, vergilendirmeye veya kapatmaya çalışabilir.

**Sonuç:** DeFi, finansın demokratikleşmesi ve aracıların (rent-seeking middlemen) ortadan kalkması için atılmış en büyük teknolojik adımdır.`
      },
      { 
        title: "Kripto Paralarda Temel Analiz Nasıl Yapılır?", 
        source: "ZetaFi Akademi", readTime: "5 dk", 
        content: `### Kriptoda Temel Analiz Kriterleri\nŞirket bilançosu olmadığı için kripto paraların değerini ölçmek farklı metrikler gerektirir:\n\n1. **Whitepaper & Çözülen Sorun:** Projenin teknik dokümanı (Whitepaper) okunmalıdır. Bu coin hangi problemi çözüyor? Sadece bir şaka coini (Meme Coin) mi, yoksa Ethereum gibi devasa bir ekosistem mi kuruyor?\n\n2. **Tokenomics (Token Ekonomisi):** Maksimum arzı sınırlı mı? (Örn: Bitcoin'in maksimum arzı 21 milyondur, bu ona nadirlik katar). Ekibin veya kurucuların elinde coinlerin %80'i mi var? (Eğer öyleyse, piyasaya aniden satış yaparak fiyatı çökertme riskleri yüksektir).\n\n3. **Geliştirici Ekip (Github Aktivitesi):** Projenin Github sayfasına bakarak kodlamanın devam edip etmediği, ekibin ne kadar aktif çalıştığı gözlemlenir. Terk edilmiş projeler ("Hayalet Zincirler") yükseliş trendlerinde bile geri kalır.\n\n4. **On-Chain (Zincir İçi) Veriler:** Aktif cüzdan sayısı artıyor mu? Ağ üzerinde yapılan işlem hacmi büyüyor mu? Balinalar (büyük cüzdanlar) coinleri borsalardan çekip soğuk cüzdanlara mı alıyor (satış baskısı azalıyor) yoksa borsaya mı taşıyor (satış hazırlığı)?`
      }
    ]
  }
];
