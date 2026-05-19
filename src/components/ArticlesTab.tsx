"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, TrendingUp, Lightbulb, Bitcoin, ShieldCheck, X, BookText, CheckCircle, Clock, ChevronRight, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Article, articleCategories } from "../data/articles";

const STORAGE_KEY = "zetafi_read_articles";

const CATEGORY_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  "temel-finans":  { bg: "bg-blue-500/10",   border: "border-blue-500/20",  badge: "bg-blue-500/10 text-blue-500" },
  "kisisel-finans":{ bg: "bg-emerald-500/10", border: "border-emerald-500/20",badge: "bg-emerald-500/10 text-emerald-500" },
  "borsa-yatirim": { bg: "bg-rose-500/10",    border: "border-rose-500/20",  badge: "bg-rose-500/10 text-rose-500" },
  "kripto-web3":   { bg: "bg-amber-500/10",   border: "border-amber-500/20", badge: "bg-amber-500/10 text-amber-500" },
};

export default function ArticlesTab() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load persisted read state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReadArticles(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }
  }, []);

  // Track reading scroll progress
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !selectedArticle) { setReadingProgress(0); return; }
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = Math.min(100, Math.round((scrollTop / Math.max(1, scrollHeight - clientHeight)) * 100));
      setReadingProgress(pct);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [selectedArticle]);

  const markRead = (article: Article) => {
    const key = article.title;
    const next = new Set(readArticles).add(key);
    setReadArticles(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
    setSelectedArticle(null);
  };

  const openArticle = (article: Article, catId: string) => {
    setSelectedArticle(article);
    setSelectedCatId(catId);
    setReadingProgress(0);
    setTimeout(() => contentRef.current?.scrollTo({ top: 0 }), 50);
  };

  const totalArticles = articleCategories.reduce((s, c) => s + c.articles.length, 0);
  const readCount = readArticles.size;
  const overallProgress = Math.round((readCount / totalArticles) * 100);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pb-10"
      >
        {/* ── Header ─────────────────────────────── */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Finansal Okuryazarlık Merkezi</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                ZetaFi Akademi tarafından hazırlanmış kapsamlı finansal eğitimler.
              </p>
            </div>
          </div>
        </header>

        {/* ── Overall progress banner ─────────────── */}
        <div className="mb-8 bg-primary/10 border border-primary/20 rounded-2xl p-5 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-primary text-sm">Neden Okumalıyım?</h4>
              <span className="text-xs font-bold text-primary tabular-nums">{readCount}/{totalArticles} Makale</span>
            </div>
            <div className="w-full bg-primary/10 rounded-full h-1.5 mb-2">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Başarılı bir portföy yönetimi şansla değil, bilgiyle mümkündür. Buradaki kaynaklar piyasa psikolojisini, trend okumayı ve risk yönetimini öğretecektir.
            </p>
          </div>
        </div>

        {/* ── Category grid ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articleCategories.map((cat, idx) => {
            const colors = CATEGORY_COLORS[cat.id] ?? { bg: "bg-secondary", border: "border-border", badge: "bg-secondary text-foreground" };
            const catReadCount = cat.articles.filter(a => readArticles.has(a.title)).length;
            const catProgress = Math.round((catReadCount / cat.articles.length) * 100);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Category header */}
                <div className={`p-5 pb-4 border-b border-border ${colors.bg}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}>
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base leading-tight">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                  {/* Category progress */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-border/60 rounded-full h-1">
                      <motion.div
                        className="bg-primary/70 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${catProgress}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{catReadCount}/{cat.articles.length}</span>
                  </div>
                </div>

                {/* Article list */}
                <div className="flex-1 p-3 space-y-1">
                  {cat.articles.map((article, i) => {
                    const isRead = readArticles.has(article.title);
                    return (
                      <button
                        key={i}
                        onClick={() => openArticle(article, cat.id)}
                        className="w-full text-left group/item flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
                      >
                        {/* Read indicator */}
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${isRead ? 'bg-emerald-500/20 text-emerald-500' : 'bg-border text-muted-foreground/30'}`}>
                          <CheckCircle className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm group-hover/item:text-primary transition-colors line-clamp-2 ${isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${colors.badge}`}>
                              {article.source}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> {article.readTime}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Completion state ─────────────────────── */}
        {readCount === totalArticles && totalArticles > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4"
          >
            <Sparkles className="w-8 h-8 text-emerald-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-500">Tebrikler — Tüm Makaleleri Okudun!</h4>
              <p className="text-sm text-muted-foreground mt-1">
                ZetaFi Akademi'nin mevcut kütüphanesini bitirdin. Yeni içerikler sürekli ekleniyor, takipte kal.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ═══ READING MODE PANEL ═══ */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-background/75 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div className="flex-1" onClick={() => setSelectedArticle(null)} />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-full md:w-[660px] bg-card h-full border-l border-border shadow-2xl flex flex-col"
            >
              {/* Reading header */}
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-card/95 backdrop-blur-sm z-10 sticky top-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookText className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">ZetaFi Okuma Modu</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums">{readingProgress}%</span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reading progress bar */}
              <div className="h-0.5 bg-border/50 w-full">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${readingProgress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>

              {/* Content */}
              <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-7 md:p-10">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {selectedCatId && (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${CATEGORY_COLORS[selectedCatId]?.badge ?? 'bg-secondary text-foreground'}`}>
                        {articleCategories.find(c => c.id === selectedCatId)?.title}
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-primary/10 text-primary flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {selectedArticle.readTime} okuma
                    </span>
                    {readArticles.has(selectedArticle.title) && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Okundu
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl font-black mb-8 leading-tight tracking-tight">
                    {selectedArticle.title}
                  </h1>

                  {/* Body — uses reading-body CSS class for full typography system */}
                  <div className="reading-body">
                    <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-border bg-secondary/20">
                <button
                  onClick={() => markRead(selectedArticle)}
                  className="w-full py-3.5 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  {readArticles.has(selectedArticle.title) ? "Okumayı Kapat" : "Tamamlandı — Okundu Olarak İşaretle"}
                </button>
                <p className="text-center text-[10px] text-muted-foreground mt-2.5">
                  ZetaFi Akademi · Bu içerik yalnızca eğitim amaçlıdır, yatırım tavsiyesi değildir.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
