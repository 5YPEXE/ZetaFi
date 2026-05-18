import { motion } from "framer-motion";
import { BookOpen, ExternalLink, TrendingUp, Lightbulb, Bitcoin, ShieldCheck } from "lucide-react";

type Article = {
  title: string;
  source: string;
  url: string;
  readTime: string;
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
      { title: "Enflasyon Nedir, Nasıl Korunulur?", source: "Bloomberg HT", readTime: "5 dk", url: "https://www.bloomberght.com" },
      { title: "Bileşik Faiz: Dünyanın 8. Harikası", source: "Investopedia", readTime: "8 dk", url: "https://www.investopedia.com/terms/c/compoundinterest.asp" },
      { title: "Merkez Bankası Faiz Kararları Piyasayı Nasıl Etkiler?", source: "Ekonomist", readTime: "6 dk", url: "https://www.ekonomist.com.tr" },
      { title: "Makroekonomi 101: Yeni Başlayanlar İçin", source: "Harvard Business Review TR", readTime: "10 dk", url: "https://hbrturkiye.com" },
    ]
  },
  {
    id: "kisisel-finans",
    title: "Kişisel Finans & Bütçe",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    description: "Kişisel bütçenizi yönetme, tasarruf stratejileri ve 50/30/20 kuralı.",
    articles: [
      { title: "50/30/20 Bütçe Kuralı Nasıl Uygulanır?", source: "Forbes", readTime: "4 dk", url: "https://www.forbes.com" },
      { title: "Acil Durum Fonu Neden Hayatidir?", source: "NerdWallet", readTime: "5 dk", url: "https://www.nerdwallet.com" },
      { title: "Borç Kartopu Yöntemiyle Borçlardan Kurtulmak", source: "Medium", readTime: "7 dk", url: "https://medium.com" },
      { title: "Erken Emeklilik (FIRE) Hareketi Nedir?", source: "Business Insider", readTime: "9 dk", url: "https://www.businessinsider.com" },
    ]
  },
  {
    id: "borsa-yatirim",
    title: "Borsa & Yatırım Stratejileri",
    icon: <TrendingUp className="w-6 h-6 text-rose-500" />,
    description: "Hisse senedi analizi, portföy çeşitlendirmesi ve risk yönetimi.",
    articles: [
      { title: "Temel ve Teknik Analiz Arasındaki Farklar", source: "TradingView", readTime: "8 dk", url: "https://tr.tradingview.com/education/" },
      { title: "Warren Buffett'ın Değer Yatırımı Stratejisi", source: "CNBC", readTime: "12 dk", url: "https://www.cnbc.com" },
      { title: "Portföy Çeşitlendirmesi Neden Önemlidir?", source: "Fidelity", readTime: "6 dk", url: "https://www.fidelity.com" },
      { title: "BIST 100'de Temettü Yatırımcılığı", source: "Borsa İstanbul", readTime: "7 dk", url: "https://www.borsaistanbul.com" },
    ]
  },
  {
    id: "kripto-web3",
    title: "Kripto Paralar & Web3",
    icon: <Bitcoin className="w-6 h-6 text-amber-500" />,
    description: "Blockchain teknolojisi, Bitcoin, altcoinler ve merkeziyetsiz finans.",
    articles: [
      { title: "Blockchain Teknolojisi Nasıl Çalışır?", source: "CoinDesk", readTime: "10 dk", url: "https://www.coindesk.com" },
      { title: "Soğuk Cüzdan (Cold Wallet) vs Sıcak Cüzdan", source: "Binance Academy", readTime: "5 dk", url: "https://academy.binance.com/tr" },
      { title: "DeFi (Merkeziyetsiz Finans) Nedir?", source: "CoinTelegraph", readTime: "8 dk", url: "https://cointelegraph.com" },
      { title: "Kripto Paralarda Temel Analiz Nasıl Yapılır?", source: "Medium", readTime: "11 dk", url: "https://medium.com" },
    ]
  }
];

export default function ArticlesTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-10">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Finansal Okuryazarlık Merkezi</h2>
            <p className="text-muted-foreground mt-1">
              Finans dünyasını daha iyi anlaman için özenle seçilmiş makaleler ve rehberler.
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
                <a 
                  key={i} 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
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
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </a>
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
            Başarılı bir portföy yönetimi şansla değil, bilgiyle mümkündür. Buradaki kaynaklar sana piyasa psikolojisini, trend okumayı ve risk yönetimini öğretecektir. Düzenli okumak finansal bağımsızlığın anahtarıdır.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
