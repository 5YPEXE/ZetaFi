import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, TrendingUp, Lightbulb, Bitcoin, ShieldCheck, X, BookText } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Article = {
  title: string;
  source: string;
  readTime: string;
  content: string;
};

type Category = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  articles: Article[];
};

const articleCategories: Category[] = [
  {
    id: "temel-finans",
    title: "Temel Finans & Ekonomi",
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    description: "Para yönetimi, enflasyon, faiz ve temel ekonomik kavramları öğrenin.",
    articles: [
      { 
        title: "Enflasyon Nedir, Nasıl Korunulur?", 
        source: "ZetaFi Akademi", readTime: "4 dk", 
        content: `### Enflasyon Nedir?\nEnflasyon, mal ve hizmetlerin fiyatlarının genel seviyesindeki sürekli artıştır. Basitçe söylemek gerekirse, paranın alım gücünün düşmesidir. Dün 100 TL'ye alabildiğiniz bir sepet dolusu ürünü, bugün 100 TL'ye alamıyorsanız enflasyonla karşı karşıyasınız demektir.\n\n### Neden Olur?\n1. **Talep Enflasyonu:** Üretilen mal ve hizmetlere olan talep, arzı aştığında fiyatlar yükselir.\n2. **Maliyet Enflasyonu:** Üretim maliyetlerinin (enerji, hammadde, işçilik) artması sonucu ürün fiyatlarının yükselmesidir.\n3. **Para Arzı:** Merkez bankalarının piyasaya karşılıksız para sürmesi, paranın değerini düşürür.\n\n### Enflasyondan Nasıl Korunulur?\nNakitte kalmak enflasyonist ortamlarda en tehlikeli stratejidir. Paranızın alım gücünü korumak için:\n- **Hisse Senetleri (Borsa):** Şirketler enflasyon oranında ürünlerine zam yapabildiği için, kârları ve hisse değerleri genellikle enflasyona paralel artar.\n- **Emtia (Altın, Gümüş):** Sınırlı arza sahip fiziksel varlıklar, itibari paraların değer kaybına karşı geleneksel bir koruma kalkanıdır.\n- **Gayrimenkul:** Kira gelirleri ve mülk değerleri genellikle enflasyonla birlikte yükselir.\n- **Kripto Varlıklar:** Özellikle Bitcoin gibi arzı matematiksel olarak sınırlı olan varlıklar, dijital altın olarak görülür ve uzun vadede enflasyona karşı koruma potansiyeli taşır.`
      },
      { 
        title: "Bileşik Faiz: Dünyanın 8. Harikası", 
        source: "ZetaFi Akademi", readTime: "3 dk", 
        content: `### Bileşik Faiz Nedir?\nAlbert Einstein'ın "Dünyanın 8. Harikası" olarak adlandırdığı söylenen bileşik faiz, basitçe **faizin de faiz kazanmasıdır.** Yatırım yaptığınız anaparadan elde ettiğiniz kârı çekmeyip tekrar yatırıma yönlendirdiğinizde, biriken toplam tutar üzerinden katlanarak kazanç sağlarsınız.\n\n### Kar Topu Etkisi\nDağın tepesinden yuvarlanan küçük bir kar topunu düşünün. Başlangıçta yavaş büyür, ancak aşağı indikçe yüzey alanı genişler ve daha fazla kar toplamaya başlar. Bir süre sonra durdurulamaz devasa bir çığa dönüşür.\n\n### Zamanın Gücü\nBileşik faizde en önemli faktör yatırılan para miktarı değil, **zamandır.**\n- 20 yaşında ayda 1.000 TL yatırım yapmaya başlayan biri, 30 yaşında aynı tutarla başlayan birine göre (aynı getiri oranında) emeklilikte kat kat daha fazla servete sahip olur.\n\n### Nasıl Uygulanır?\n1. Erken başlayın.\n2. Kazançlarınızı (temettü, faiz veya kâr payı) harcamak yerine tekrar yatırıma dönüştürün.\n3. Uzun vadeli düşünün ve piyasa dalgalanmalarında panik yapmayın.`
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
        source: "ZetaFi Akademi", readTime: "3 dk", 
        content: `### 50/30/20 Kuralı Nedir?\nPopülerleşen bu basit bütçeleme kuralı, aylık net gelirinizi üç temel kategoriye ayırmanızı söyler:\n\n1. **%50 - İhtiyaçlar (Zorunlu Giderler):**\nKira, faturalar, mutfak masrafları, sağlık, ulaşım ve asgari borç ödemeleri. Bu kategori hayatta kalmak için zorunlu olan her şeyi kapsar.\n\n2. **%30 - İstekler (Keyfi Harcamalar):**\nDışarıda yemek yeme, hobiler, tatiller, abonelikler (Netflix, Spotify) ve alışveriş. Hayattan keyif almanızı sağlayan harcamalardır.\n\n3. **%20 - Tasarruf ve Yatırım:**\nAcil durum fonu oluşturmak, hisse senedi veya kripto yatırımı yapmak, bireysel emeklilik ve borçları hızlıca kapatmak için ayrılan paydır.\n\n### Neden İşe Yarıyor?\nBu kural, sizi katı ve boğucu bütçelerden kurtarır. İhtiyaçlarınızı karşılarken hayattan da keyif almanıza izin verir, ancak geleceğinizi güvence altına almayı da asla ihmal etmez.`
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
        source: "ZetaFi Akademi", readTime: "4 dk", 
        content: `### Temel Analiz\nBir şirketin veya varlığın **gerçek değerini** (içsel değer) bulmaya odaklanır. Şirketin bilançosu, kârlılığı, sektördeki konumu, yönetim kadrosu ve makroekonomik veriler incelenir.\n* Soru: "Bu ne kadar eder ve uzun vadede büyüyecek mi?"\n* Araçlar: F/K Oranı, PD/DD, Bilanço Raporları.\n* Uygulama: Warren Buffett tarzı uzun vadeli değer yatırımı.\n\n### Teknik Analiz\nFiyatın geçmiş hareketlerini inceleyerek **gelecekteki yönünü** tahmin etmeye odaklanır. İstatistik, grafikler ve indikatörler kullanılır. Şirketin ne iş yaptığıyla ilgilenmez, tamamen piyasa psikolojisini ve arz-talep dengesini okur.\n* Soru: "Fiyatın trendi ne yönde ve nerede dönüş yapabilir?"\n* Araçlar: Mum Grafikleri, RSI, MACD, Destek/Direnç seviyeleri.\n* Uygulama: Kısa ve orta vadeli al-sat (trading) işlemleri.\n\n**Hangisi Daha İyi?**\nEn başarılı yatırımcılar, uzun vadeli vizyon için Temel Analizi kullanırken, doğru alım-satım zamanlamasını (timing) yapmak için Teknik Analizden faydalanır.`
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
        source: "ZetaFi Akademi", readTime: "5 dk", 
        content: `### DeFi (Decentralized Finance)\nBankalar, aracı kurumlar veya borsalar gibi merkezi otoritelere ihtiyaç duymadan; borç verme, borç alma, faiz kazanma ve varlık takası (trading) işlemlerini akıllı kontratlar (Smart Contracts) aracılığıyla blokzincir üzerinde yapmanızı sağlayan finansal ekosistemdir.\n\n### Geleneksel Finans (CeFi) vs DeFi\n- **Hesap Açılışı:** Bankada hesap açmak için kimlik, ikametgah ve onay gerekir. DeFi'de sadece bir MetaMask cüzdanınızın olması yeterlidir. Kimlik (KYC) sorulmaz.\n- **Çalışma Saatleri:** Bankalar hafta içi 9-5 çalışır, EFT gecikebilir. DeFi 7/24/365 açıktır, işlemler saniyeler içinde gerçekleşir.\n- **Kontrol:** Banka paranızı dondurabilir veya hesabınızı bloke edebilir. DeFi'de kod kanundur (Code is Law); cüzdan şifreniz sizde olduğu sürece paranıza kimse dokunamaz.\n\n### Riskleri Nelerdir?\nSistem tamamen koda dayalı olduğu için, akıllı kontratlarda bir yazılım açığı (bug) varsa hackerlar sistemdeki tüm parayı çalabilir (Hack riski). Ayrıca bir bankadaki gibi "şifremi unuttum" diyerek arayabileceğiniz bir müşteri hizmetleri yoktur.`
      },
      { 
        title: "Kripto Paralarda Temel Analiz Nasıl Yapılır?", 
        source: "ZetaFi Akademi", readTime: "5 dk", 
        content: `### Kriptoda Temel Analiz Kriterleri\nŞirket bilançosu olmadığı için kripto paraların değerini ölçmek farklı metrikler gerektirir:\n\n1. **Whitepaper & Çözülen Sorun:** Projenin teknik dokümanı (Whitepaper) okunmalıdır. Bu coin hangi problemi çözüyor? Sadece bir şaka coini (Meme Coin) mi, yoksa Ethereum gibi devasa bir ekosistem mi kuruyor?\n\n2. **Tokenomics (Token Ekonomisi):** Maksimum arzı sınırlı mı? (Örn: Bitcoin'in maksimum arzı 21 milyondur, bu ona nadirlik katar). Ekibin veya kurucuların elinde coinlerin %80'i mi var? (Eğer öyleyse, piyasaya aniden satış yaparak fiyatı çökertme riskleri yüksektir).\n\n3. **Geliştirici Ekip (Github Aktivitesi):** Projenin Github sayfasına bakarak kodlamanın devam edip etmediği, ekibin ne kadar aktif çalıştığı gözlemlenir. Terk edilmiş projeler ("Hayalet Zincirler") yükseliş trendlerinde bile geri kalır.\n\n4. **On-Chain (Zincir İçi) Veriler:** Aktif cüzdan sayısı artıyor mu? Ağ üzerinde yapılan işlem hacmi büyüyor mu? Balinalar (büyük cüzdanlar) coinleri borsalardan çekip soğuk cüzdanlara mı alıyor (satış baskısı azalıyor) yoksa borsaya mı taşıyor (satış hazırlığı)?`
      }
    ]
  }
];

export default function ArticlesTab() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-10">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Finansal Okuryazarlık Merkezi</h2>
              <p className="text-muted-foreground mt-1">
                Finans dünyasını daha iyi anlaman için ZetaFi Akademi tarafından hazırlanmış eğitimler.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articleCategories.map((cat, idx) => (
            <motion.div 
              key={cat.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                <div className="p-3 bg-secondary rounded-xl">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{cat.description}</p>
                </div>
              </div>

              <div className="flex-1 space-y-3 mt-2">
                {cat.articles.map((article, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedArticle(article)}
                    className="w-full text-left group flex items-start justify-between p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="pr-4">
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-background border border-border rounded-md text-muted-foreground">
                          {article.source}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" /> {article.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                      <BookText className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 bg-primary/10 border border-primary/20 rounded-2xl p-6 flex items-center gap-4">
          <Lightbulb className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <h4 className="font-bold text-primary">Neden Okumalıyım?</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Başarılı bir portföy yönetimi şansla değil, bilgiyle mümkündür. Buradaki kaynaklar sana piyasa psikolojisini, trend okumayı ve risk yönetimini öğretecektir.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%', opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full md:w-[600px] bg-card h-full border-l border-border shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-card z-10 sticky top-0">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <BookText className="w-4 h-4" /> ZetaFi Okuma Modu
                </div>
                <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md mb-4">
                  {selectedArticle.readTime} Okuma Süresi
                </span>
                <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                  {selectedArticle.title}
                </h1>
                
                <div className="text-base md:text-lg [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-6 [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_li]:mb-2 [&_li]:text-muted-foreground [&_strong]:text-foreground [&_strong]:font-bold">
                  <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                </div>
              </div>
              
              <div className="p-6 border-t border-border bg-secondary/30">
                <button onClick={() => setSelectedArticle(null)} className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity">
                  Okumayı Tamamla
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
