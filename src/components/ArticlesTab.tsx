import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, TrendingUp, Lightbulb, Bitcoin, ShieldCheck, X, BookText } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Article, articleCategories } from "../data/articles";

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
