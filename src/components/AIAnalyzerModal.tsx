"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Bot, Activity, TrendingUp, TrendingDown, Clock, Newspaper, ExternalLink, Wifi, WifiOff, BarChart3, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { supabase } from "../lib/supabase";

type NewsItem = { id: number; title: string; source: string; time: string; exactDate: string; url: string; isLive: boolean; publishedAt: number };
type ChartPoint = { date: string; price?: number; forecast?: number };
type AIAnalyzerModalProps = {
  asset: { id: string; name: string; symbol: string; currentPrice: number; currencySymbol: string; change24h: number; sparkline?: { value: number }[]; };
  usdRate?: number;
  currentUser?: { email?: string; user_metadata?: { display_name?: string } } | null;
  onClose: () => void;
};

// ==================== ZAMAN SERİSİ ANALİZİ ====================
const fetchHistoricalPrices = async (assetId: string, sparkline?: { value: number }[], currentPrice?: number, isTry?: boolean, usdRate?: number): Promise<{ prices: number[]; dates: string[] }> => {
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  
  // CoinGecko ID düzeltme (Symbol bazen ID'den farklıdır, ör: PEPE)
  const cgId = assetId.toLowerCase();
  
  // Yöntem 1: CoinGecko API (kripto paralar için)
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=90&interval=daily`, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      if (data.prices?.length > 10) {
        const rate = (isTry && usdRate) ? usdRate : 1;
        return {
          prices: data.prices.map((p: number[]) => p[1] * rate),
          dates: data.prices.map((p: number[]) => { const d = new Date(p[0]); return `${d.getDate()} ${months[d.getMonth()]}`; })
        };
      }
    }
  } catch (e) { console.warn(`CoinGecko fetch failed for ${cgId}:`, e); }
  
  // Yöntem 2: Sparkline verisinden (geçici)
  if (sparkline && sparkline.length >= 5 && currentPrice) {
    const srcValues = sparkline.map(s => s.value);
    const targetDays = 90;
    const prices: number[] = [];
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < targetDays; i++) {
      const ratio = i / (targetDays - 1);
      const srcIdx = ratio * (srcValues.length - 1);
      const interpolated = srcValues[Math.floor(srcIdx)];
      prices.push(interpolated);
      const d = new Date(today);
      d.setDate(today.getDate() - (targetDays - 1 - i));
      dates.push(`${d.getDate()} ${months[d.getMonth()]}`);
    }
    return { prices, dates };
  }
  
  return { prices: [], dates: [] };
};

const forecastTimeSeries = (prices: number[], dates: string[], forecastDays: number = 30, sentimentScore: number = 0): { historical: ChartPoint[]; forecast: ChartPoint[]; } => {
  if (prices.length < 10) return { historical: [], forecast: [] };
  const n = prices.length;
  
  // --- İstatistiksel Zaman Serisi Analizi (Holt-Winters Temelli) ---
  // 1. Parametreler (Dinamik olarak hesaplanır)
  const alpha = 0.3; // Level smoothing
  const beta = 0.1;  // Trend smoothing
  const phi = 0.95;  // Damping factor (Trend sönümleme - Finansal piyasalar için kritik)

  let level = prices[0];
  let trend = prices[1] - prices[0];

  // 2. Geçmiş Veri Üzerinden Model Eğitimi (Smoothing)
  for (let i = 1; i < n; i++) {
    const lastLevel = level;
    level = alpha * prices[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - lastLevel) + (1 - beta) * trend;
  }

  // 3. Volatilite Analizi
  const recent = prices.slice(-20);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const std = Math.sqrt(recent.reduce((s, p) => s + (p - avg) ** 2, 0) / recent.length);
  const volRatio = Math.max(0.01, std / avg);

  const historical: ChartPoint[] = dates.map((d, i) => ({ date: d, price: prices[i] }));
  const forecast: ChartPoint[] = [];
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const today = new Date();

  forecast.push({ date: dates[dates.length - 1], price: prices[n - 1], forecast: prices[n - 1] });

  // 4. Projeksiyon (İleriye Dönük Tahmin)
  // Haber duygusunun trend üzerindeki istatistiksel kayması (Bias)
  const sentimentBias = (sentimentScore / 100) * (volRatio * level * 0.1);
  let adjustedTrend = trend + sentimentBias;

  for (let i = 1; i <= forecastDays; i++) {
    // Holt'un Damped Trend Denklemi: y(t+h) = level + (phi^1 + phi^2 + ... + phi^h) * trend
    // Burada kümülatif sönümleme uygulanır.
    const dampenedTrendSum = Array.from({ length: i }, (_, k) => Math.pow(phi, k + 1))
      .reduce((a, b) => a + b, 0);
    
    let predicted = level + dampenedTrendSum * adjustedTrend;

    // Gerçekçilik Filtresi: Volatilite bazlı standart hata ekle (küçük sapmalar)
    const errorTerm = (Math.sin(i * 0.5) * 0.2) * std; 
    predicted += errorTerm;

    // Sınırlandırma (Aşırı uçları engelle ama trendi bozma)
    predicted = Math.max(prices[n-1] * 0.4, Math.min(prices[n-1] * 2.5, predicted));

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    forecast.push({ date: `${futureDate.getDate()} ${months[futureDate.getMonth()]}`, forecast: predicted });
  }

  return { historical, forecast };
};

// ==================== HABER ÇEKİCİ (ÇOK KAYNAKLI) ====================
const fetchLiveNews = async (name: string, symbol: string): Promise<NewsItem[]> => {
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const allItems: NewsItem[] = [];
  
  const queries = [
    `${name} ${symbol}`,                    // Türkçe genel
    `${symbol} hisse borsa`,                // Borsa odaklı
    `${symbol} stock price forecast`,       // İngilizce
  ];
  
  const apiUrls = queries.map(q => `/api/news?q=${encodeURIComponent(q)}`);

  try {
    const results = await Promise.allSettled(
      apiUrls.map(url => fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }))
    );

    const seenTitles = new Set<string>();
    
    for (const result of results) {
      if (result.status !== 'fulfilled' || !result.value.items) continue;
      for (const item of result.value.items.slice(0, 8)) {
        const cleanTitle = (item.title || "").replace(/ - [^-]+$/, "").trim();
        if (seenTitles.has(cleanTitle)) continue;
        seenTitles.add(cleanTitle);
        
        const d = new Date(item.pubDate || "");
        const now = new Date();
        const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
        const hrs = Math.floor(mins / 60);
        const days = Math.floor(hrs / 24);
        const time = mins < 60 ? `${Math.max(1, mins)} dk önce` : hrs < 24 ? `${hrs} saat önce` : `${days} gün önce`;
        const srcMatch = (item.title || "").match(/ - ([^-]+)$/);
        allItems.push({
          id: allItems.length + 1,
          title: cleanTitle,
          source: srcMatch?.[1]?.trim() || "Google News",
          time,
          exactDate: `${d.getDate()} ${months[d.getMonth()]} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`,
          url: item.link || "",
          isLive: true,
          publishedAt: d.getTime()
        });
      }
    }
  } catch (err) {
    console.error("News fetch error:", err);
  }

  allItems.sort((a, b) => b.publishedAt - a.publishedAt);
  return allItems.slice(0, 15);
};

// NLP Motoru sadece gerçek haberleri analiz eder.

// ==================== 4 KATMANLI ANALİZ MOTORU (GELİŞMİŞ NLP) ====================
const POS_KW = ['yükseliş','yükseldi','artış','arttı','rekor','pozitif','güçlü','destekliyor','iyimser','talep','alım','büyüme','kazanç','onay','patlama','toparlanma','rally','surge','bullish','gain','high','boost','profit','growth','teşvik','hızlandı','toplamaya','artıyor','hedef fiyat','bedelsiz','açık standart','kar','temettü','ihracat','verimli','dönüşüm','stratejik','ortaklık','genişleme','ralli','sıçrama','yükselen','güçleniyor','kârlılık','potansiyel','fırsat','upgrade','outperform','beat','exceed','strong','recovery','breakout','momentum','uptick','optimistic'];
const NEG_KW = ['düşüş','düştü','azalış','kayıp','negatif','zayıf','baskı','endişe','risk','satış','kriz','çöküş','gerileme','crash','drop','bearish','loss','decline','fall','fear','selloff','düzeltme','sert','gerilim','oynaklık','tehdit','yasak','ceza','soruşturma','hack','iflas','daralma','küçülme','zarar','borç','temerrüt','resesyon','enflasyon','faiz artışı','belirsizlik','kaçış','panik','durgunluk','downgrade','underperform','miss','weak','correction','plunge','slump','concern','warning','volatile','pressure'];

// Tüm hesaplanmış metriklerle birlikte Gemini'ye tek büyük istek at
const analyzeWithGemini = async (
  items: NewsItem[],
  symbol: string,
  technicalMetrics: {
    trendScore: number; trendDir: string; rsiLabel: string; rsiValue: number;
    forecastPct: number; forecastDir: string; change24h: number;
    currentPrice: number; currencySymbol: string; name: string;
  },
  requestedBy?: string,
  forceRefresh?: boolean,
) => {
  const empty = { score: 0, pos: 0, neg: 0, neutral: 0, priceSignal: 'Veri Yok' as string, reasoning: '', geminiReport: null as GeminiReport | null, fromCache: false, cachedBy: null as string | null, cachedAt: null as string | null };
  if (items.length === 0) return empty;

  try {
    const res = await fetch('/api/analyze-sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headlines: items.map(i => i.title), symbol, technicalMetrics, requestedBy, forceRefresh })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        score: data.score ?? 0,
        pos: data.pos ?? 0,
        neg: data.neg ?? 0,
        neutral: data.neutral ?? 0,
        priceSignal: (data.priceSignal as string) || 'Veri Yok',
        reasoning: '',
        geminiReport: (data.report as GeminiReport) || null,
        fromCache: !!data.fromCache,
        cachedBy: (data.cachedBy as string) || null,
        cachedAt: (data.cachedAt as string) || null,
      };
    }
  } catch (e) { console.warn('Gemini API failed, using local NLP fallback.'); }

  // Fallback: yerel keyword heuristic
  let pos = 0, neg = 0;
  items.forEach(i => { const l = i.title.toLowerCase(); const p = POS_KW.filter(k => l.includes(k)).length; const n = NEG_KW.filter(k => l.includes(k)).length; if (p > n) pos++; else if (n > p) neg++; });
  const total = Math.max(1, items.length);
  return { score: ((pos - neg) / total) * 100, pos, neg, neutral: items.length - pos - neg, priceSignal: 'Veri Yok' as string, reasoning: '', geminiReport: null, fromCache: false, cachedBy: null, cachedAt: null };
};

const calculateSMA = (prices: number[], period: number) => {
  if (!prices || prices.length < period) return prices[prices.length - 1] || 0;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
};

const calculateRSI = (prices: number[], period: number = 14) => {
  if (!prices || prices.length <= period) return 50;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
  }
  if (avgLoss === 0) return 100;
  return 100 - (100 / (1 + (avgGain / avgLoss)));
};

const analyzeTrend = (prices: number[]) => {
  if (!prices || prices.length < 20) return { score: 0, dir: 'Yatay', support: 0, resistance: 0 };
  const sma10 = calculateSMA(prices, 10);
  const sma30 = calculateSMA(prices, 30);
  const pct = ((sma10 - sma30) / sma30) * 100;
  return { score: Math.max(-100, Math.min(100, pct * 15)), dir: pct > 1 ? 'Yükseliş' : pct < -1 ? 'Düşüş' : 'Yatay', support: Math.min(...prices), resistance: Math.max(...prices) };
};

const analyzeMomentum = (prices: number[], change24h: number) => {
  const rsiVal = calculateRSI(prices);
  // Score shifts based on RSI
  const score = (rsiVal - 50) * 2; 
  return {
    score: Math.max(-100, Math.min(100, score)),
    rsi: rsiVal > 70 ? 'Aşırı Alım' : rsiVal > 55 ? 'Güçlü Alım' : rsiVal < 30 ? 'Aşırı Satım' : rsiVal < 45 ? 'Güçlü Satım' : 'Nötr',
    value: Math.round(rsiVal)
  };
};

type GeminiReport = {
  marketOutlook: string;
  integratedAnalysis: string;
  catalysts: string[];
  risks: string[];
  analystConclusion: string;
};

type Pred = {
  sentiment: string;
  score: number;
  reason: string;
  geminiReport: GeminiReport | null; // Gemini'den gelen tam rapor
  details: {
    newsScore: number; trendScore: number; momScore: number; forecastScore: number;
    rsi: string; trendDir: string; posNews: number; negNews: number; neutralNews: number; forecastDir: string;
    priceSignal: string; confidenceLevel: string; volatilityState: string;
  };
  w1: number; m1: number; m3: number; w1P: number; m1P: number; m3P: number;
};

// Sadece sayısal hesapları yapar, rapor Gemini'den gelir
const computeMetrics = (price: number, change24h: number, historicalPrices: number[], forecastPct: number, ns: any) => {
  const tr = analyzeTrend(historicalPrices);
  const mo = analyzeMomentum(historicalPrices, change24h);
  const forecastScore = Math.max(-100, Math.min(100, forecastPct * 8));
  const forecastDir = forecastPct > 1 ? 'Yükseliş' : forecastPct < -1 ? 'Düşüş' : 'Yatay';
  const weighted = ns.score * 0.25 + tr.score * 0.20 + mo.score * 0.15 + forecastScore * 0.40;
  const finalScore = Math.max(0, Math.min(100, Math.round(50 + weighted / 2)));
  const bull = finalScore >= 50;
  const vol = Math.max(2, Math.abs(change24h) * 1.2 + Math.abs(weighted) * 0.05);
  const volatilityState = vol > 8 ? 'Yüksek' : vol > 4 ? 'Orta' : 'Düşük';
  const confidenceLevel = finalScore >= 70 || finalScore <= 30 ? 'Yüksek' : finalScore >= 60 || finalScore <= 40 ? 'Orta' : 'Düşük';
  const w1 = bull ? (vol * 0.4 + (finalScore - 50) * 0.05) : -(vol * 0.35 + (50 - finalScore) * 0.05);
  const m1 = bull ? (vol * 1.2 + (finalScore - 50) * 0.15) : -(vol * 1.0 + (50 - finalScore) * 0.12);
  const m3 = bull ? (vol * 2.5 + (finalScore - 50) * 0.3) : -(vol * 2.0 + (50 - finalScore) * 0.25);
  return {
    tr, mo, forecastScore, forecastDir, finalScore, vol, volatilityState, confidenceLevel,
    w1, m1, m3,
    w1P: price * (1 + w1 / 100), m1P: price * (1 + m1 / 100), m3P: price * (1 + m3 / 100),
  };
};

// ==================== COMPONENT ====================
export default function AIAnalyzerModal({ asset, usdRate = 38.5, currentUser, onClose }: AIAnalyzerModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [loadingText, setLoadingText] = useState("KAP ve Global Haberler Taranıyor...");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isNewsLive, setIsNewsLive] = useState(false);
  const [pred, setPred] = useState<Pred | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [forecastStart, setForecastStart] = useState('');
  const [cacheInfo, setCacheInfo] = useState<{ fromCache: boolean; cachedBy: string | null; cachedAt: string | null }>({ fromCache: false, cachedBy: null, cachedAt: null });

  const getUserDisplayName = () => {
    if (!currentUser) return 'Anonim';
    return (currentUser.user_metadata as Record<string, string>)?.display_name
      || currentUser.email?.split('@')[0] || 'Kullanıcı';
  };

  const runAnalysis = async (forceRefresh = false) => {
    setIsAnalyzing(true);
    setPred(null);
    setLoadingText('KAP ve Global Haberler Taranıyor...');
    const run = async () => {
      const isTry = asset.currencySymbol === '₺';

      // 1. Paralel: haberler + geçmiş fiyatlar
      const [live, hist] = await Promise.all([
        fetchLiveNews(asset.name, asset.symbol).catch(() => []),
        fetchHistoricalPrices(asset.id, asset.sparkline, asset.currentPrice, isTry, usdRate)
      ]);
      setIsNewsLive(live.length > 0);
      setNews(live);

      // 2. Zaman serisi hesapla (placeholder score=0 ile, sonra Gemini'den gelecek)
      let forecastPct = 0;
      let chartHistorical: ChartPoint[] = [];
      let chartForecast: ChartPoint[] = [];
      if (hist.prices.length > 10) {
        const { historical, forecast } = forecastTimeSeries(hist.prices, hist.dates, 30, 0);
        chartHistorical = historical;
        chartForecast = forecast;
        setForecastStart(historical[historical.length - 1]?.date || '');
        setChartData([...historical, ...forecast]);
        const lastReal = hist.prices[hist.prices.length - 1];
        const last30 = forecast[forecast.length - 1]?.forecast || lastReal;
        forecastPct = ((last30 - lastReal) / lastReal) * 100;
      }

      // 3. Teknik metrikleri hesapla
      const tr = analyzeTrend(hist.prices);
      const mo = analyzeMomentum(hist.prices, asset.change24h);
      const forecastDir = forecastPct > 1 ? 'Yükseliş' : forecastPct < -1 ? 'Düşüş' : 'Yatay';

      // 4. TÜM metrikleri Gemini'ye gönder → tek bütünleşik analiz
      const ns = await analyzeWithGemini(live, asset.symbol, {
        trendScore: Math.round(tr.score),
        trendDir: tr.dir,
        rsiLabel: mo.rsi,
        rsiValue: mo.value,
        forecastPct,
        forecastDir,
        change24h: asset.change24h,
        currentPrice: asset.currentPrice,
        currencySymbol: asset.currencySymbol,
        name: asset.name,
      }, getUserDisplayName(), forceRefresh);

      setCacheInfo({ fromCache: ns.fromCache, cachedBy: ns.cachedBy, cachedAt: ns.cachedAt });

      // 5. Zaman serisini Gemini skoru ile yeniden hesapla (daha doğru tahmin)
      if (hist.prices.length > 10) {
        const { historical, forecast } = forecastTimeSeries(hist.prices, hist.dates, 30, ns.score);
        setForecastStart(historical[historical.length - 1]?.date || '');
        setChartData([...historical, ...forecast]);
        const lastReal = hist.prices[hist.prices.length - 1];
        const last30 = forecast[forecast.length - 1]?.forecast || lastReal;
        forecastPct = ((last30 - lastReal) / lastReal) * 100;
      }

      // 6. Sayısal hesapları yap (w1/m1/m3 fiyat tahminleri)
      const m = computeMetrics(asset.currentPrice, asset.change24h, hist.prices, forecastPct, ns);

      setPred({
        sentiment: m.finalScore >= 60 ? 'Boğa (Yükseliş)' : m.finalScore <= 40 ? 'Ayı (Düşüş)' : 'Nötr',
        score: m.finalScore,
        reason: `📊 Haber: ${ns.pos}+ / ${ns.neg}-. 📈 Trend: ${m.tr.dir}. ⚡ RSI: ${m.mo.rsi}. 🔮 Projeksiyon: ${forecastPct.toFixed(1)}%.`,
        geminiReport: ns.geminiReport,
        details: {
          newsScore: Math.round(ns.score), trendScore: Math.round(m.tr.score),
          momScore: Math.round(m.mo.score), forecastScore: Math.round(m.forecastScore),
          rsi: m.mo.rsi, trendDir: m.tr.dir,
          posNews: ns.pos, negNews: ns.neg, neutralNews: ns.neutral,
          forecastDir: m.forecastDir, priceSignal: ns.priceSignal ?? 'Veri Yok',
          confidenceLevel: m.confidenceLevel, volatilityState: m.volatilityState,
        },
        w1: m.w1, m1: m.m1, m3: m.m3,
        w1P: m.w1P, m1P: m.m1P, m3P: m.m3P,
      });
      // Analiz tamamlandığında yüklemeyi kapat
      setIsAnalyzing(false);
    };
    run();
  };

  useEffect(() => {
    runAnalysis();
    const t1 = setTimeout(() => setLoadingText('3 Farklı Kaynaktan Haberler Taranıyor...'), 800);
    const t2 = setTimeout(() => setLoadingText('RSI/SMA ve Holt-Winters Modeli Hesaplanıyor...'), 1800);
    const t3 = setTimeout(() => setLoadingText('Tüm Metrikler Gemini AI\'e Gönderiliyor...'), 2800);
    const t4 = setTimeout(() => setLoadingText('Bütünleşik Analiz Raporu Oluşturuluyor...'), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.symbol]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-secondary/30 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">ZetaFi AI Analisti <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full uppercase tracking-wider font-bold">v3.2</span></h2>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm text-muted-foreground">{asset.name} ({asset.symbol}) · Kurumsal Düzey Analiz Raporu</p>
                {!isAnalyzing && cacheInfo.fromCache && cacheInfo.cachedBy && cacheInfo.cachedAt && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {cacheInfo.cachedBy} • {new Date(cacheInfo.cachedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            {!isAnalyzing && (
              <button
                onClick={() => runAnalysis(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Yeni analiz üret">
                <RefreshCw className="w-3.5 h-3.5" />
                Yenile
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
              {/* Cinematic analysis animation */}
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 border-2 border-primary/10 rounded-full" />
                <div className="absolute inset-0 border-2 border-primary/30 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-2 border-2 border-primary/20 rounded-full border-b-transparent animate-spin" style={{ animationDuration: '1.4s', animationDirection: 'reverse' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>

              {/* Step indicator */}
              <div className="space-y-3 w-full max-w-xs">
                {[
                  "Haberler Taranıyor",
                  "RSI / SMA Hesaplama",
                  "Holt-Winters Modeli",
                  "Gemini AI'e Gönderiliyor",
                  "Rapor Oluşturuluyor"
                ].map((step, i) => {
                  const stepTimes = [800, 1800, 2800, 3800, 5000];
                  const isCurrent = loadingText.includes(['Haber', 'RSI', 'Holt', 'Metrik', 'Bütün'][i] ?? '');
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'border-primary bg-primary/10 animate-pulse'
                          : 'border-border bg-secondary'
                      }`}>
                        {isCurrent && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className={`text-xs transition-colors ${
                        isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'
                      }`}>{step}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm font-semibold text-primary animate-pulse text-center px-4">{loadingText}</p>
            </div>
          ) : pred && (
            <div className="space-y-8 animate-data-stream">
              {/* ── Top Summary Stats ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sentiment / Score */}
                <div className="bg-secondary/30 border border-border rounded-2xl p-5 flex flex-col items-center text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Genel Görünüm</p>
                  <div className="flex items-center gap-3 mb-3">
                    {pred.score >= 60 ? <TrendingUp className="w-7 h-7 text-emerald-500" /> : pred.score <= 40 ? <TrendingDown className="w-7 h-7 text-rose-500" /> : <Activity className="w-7 h-7 text-amber-400" />}
                    <span className={`text-xl font-black ${pred.score >= 60 ? 'text-emerald-500' : pred.score <= 40 ? 'text-rose-500' : 'text-amber-400'}`}>{pred.sentiment}</span>
                  </div>
                  {/* Confidence arc */}
                  <div className="relative w-20 h-10 mb-3 overflow-hidden">
                    <svg className="w-20 h-20 -mt-10 transform" viewBox="0 0 80 80">
                      <path d="M 10 70 A 30 30 0 0 1 70 70" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" strokeLinecap="round" />
                      <path
                        d="M 10 70 A 30 30 0 0 1 70 70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(pred.score / 100) * 94} 94`}
                        className={`transition-all duration-1000 ${pred.score >= 60 ? 'text-emerald-500' : pred.score <= 40 ? 'text-rose-500' : 'text-amber-400'}`}
                      />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xl font-black tabular-nums leading-none">{pred.score}</div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">/ 100 Güven Skoru</p>
                </div>

                {/* Model quality */}
                <div className="bg-secondary/30 border border-border rounded-2xl p-5 flex flex-col justify-center gap-3.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Model Kalitesi</p>
                  {[
                    { label: 'Model Güveni', value: pred.details.confidenceLevel ?? 'Orta', color: 'bg-primary/10 text-primary' },
                    { label: 'Volatilite', value: pred.details.volatilityState ?? 'Düşük', color: 'bg-amber-500/10 text-amber-500' },
                    { label: 'Momentum', value: pred.details.rsi, color: pred.details.rsi.includes('Alım') ? 'bg-emerald-500/10 text-emerald-500' : pred.details.rsi.includes('Satım') ? 'bg-rose-500/10 text-rose-500' : 'bg-secondary text-muted-foreground' },
                    { 
                      label: 'Fiyat/Haber Uyumu', 
                      value: pred.details.priceSignal ?? 'Veri Yok', 
                      color: pred.details.priceSignal === 'Haberlerle Uyumlu' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : pred.details.priceSignal === 'Haberlerle Çelişiyor' 
                          ? 'bg-rose-500/10 text-rose-500' 
                          : 'bg-secondary text-muted-foreground' 
                    },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Signed layer contributions */}
                <div className="bg-secondary/30 border border-border rounded-2xl p-5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Katman Katkıları</p>
                  <div className="space-y-2.5">
                    {[
                      { l: 'Haber Duygu', v: pred.details.newsScore },
                      { l: 'Teknik Trend', v: pred.details.trendScore },
                      { l: 'Zaman Serisi', v: pred.details.forecastScore },
                    ].map(row => (
                      <div key={row.l}>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-muted-foreground">{row.l}</span>
                          <span className={`font-bold tabular-nums ${row.v >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {row.v >= 0 ? '+' : ''}{row.v}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden relative">
                          {/* Midpoint line */}
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/80" />
                          {row.v >= 0 ? (
                            <div
                              className="absolute left-1/2 h-full bg-emerald-500 rounded-r-full transition-all duration-700"
                              style={{ width: `${Math.abs(row.v) / 2}%` }}
                            />
                          ) : (
                            <div
                              className="absolute right-1/2 h-full bg-rose-500 rounded-l-full transition-all duration-700"
                              style={{ width: `${Math.abs(row.v) / 2}%` }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* RSI numeric */}
                  <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">RSI (14)</span>
                    <span className={`text-xs font-black tabular-nums ${
                      pred.details.rsi === 'Aşırı Alım' ? 'text-rose-500'
                      : pred.details.rsi === 'Güçlü Alım' ? 'text-emerald-500'
                      : pred.details.rsi === 'Aşırı Satım' ? 'text-blue-500'
                      : 'text-muted-foreground'
                    }`}>{pred.details.rsi}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Report Section — Gemini'den gelen yapılandırılmış rapor */}
              {pred.geminiReport ? (
                <div className="space-y-6">
                  {/* Piyasa Görünümü */}
                  <div className="bg-secondary/15 border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-all">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Piyasa Görünümü
                    </h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{pred.geminiReport.marketOutlook}</p>
                  </div>

                  {/* Grafik — Görünüm kartından hemen sonra */}
                  {chartData.length > 0 && (
                    <div className="bg-secondary/15 border border-border/50 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-sm font-bold flex items-center gap-2"><Activity className="w-4 h-4" /> Zaman Serisi Projeksiyonu</h3>
                          <p className="text-xs text-muted-foreground mt-1">Holt-Winters Damped Trend Modeli · 90G Geçmiş + 30G Tahmin</p>
                        </div>
                        <div className="flex gap-4 text-[10px] font-medium">
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Geçmiş</div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Tahmin</div>
                        </div>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="gradHistory" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={14} stroke="#64748b" />
                            <YAxis tick={{ fontSize: 9 }} domain={['auto', 'auto']} stroke="#64748b" tickFormatter={(v: number) => `${asset.currencySymbol}${v >= 1000 ? (v/1000).toFixed(1)+'K' : v.toFixed(0)}`} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }} formatter={(value: any) => [`${asset.currencySymbol}${Number(value).toLocaleString(asset.currencySymbol === '₺' ? 'tr-TR' : 'en-US', { maximumFractionDigits: 2 })}`, '']} labelStyle={{ color: '#94a3b8' }} />
                            {forecastStart && <ReferenceLine x={forecastStart} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Bugün", fill: "#f59e0b", fontSize: 10, position: "top" }} />}
                            <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fill="url(#gradHistory)" dot={false} name="Geçmiş" connectNulls={false} />
                            <Area type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" fill="url(#gradForecast)" dot={false} name="Tahmin" connectNulls={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center justify-center gap-6 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" /> Geçmiş Fiyat (90 gün)</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" style={{ borderBottom: '1px dashed' }} /> AI Tahmin (30 gün)</span>
                      </div>
                    </div>
                  )}

                  {/* Bütünleşik Analiz */}
                  <div className="bg-secondary/15 border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-all">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Bütünleşik Analiz
                    </h3>
                    {pred.geminiReport.integratedAnalysis.includes('⚠️') ? (
                      <p className="text-sm text-amber-400 bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 leading-relaxed">
                        {pred.geminiReport.integratedAnalysis}
                      </p>
                    ) : (
                      <p className="text-sm text-foreground/80 leading-relaxed">{pred.geminiReport.integratedAnalysis}</p>
                    )}
                  </div>

                  {/* Katalizörler & Riskler */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-secondary/15 border border-border/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-all">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Temel Katalizörler
                      </h3>
                      <div className="space-y-2">
                        {pred.geminiReport.catalysts.map((c, i) => (
                          <div key={i} className="p-3 rounded-xl border bg-emerald-500/5 border-emerald-500/10 flex gap-3 items-start">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-500" />
                            <p className="text-sm text-foreground/85 leading-relaxed">{c}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-secondary/15 border border-border/50 rounded-2xl p-6 hover:border-rose-500/20 transition-all">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" /> Risk Faktörleri
                      </h3>
                      <div className="space-y-2">
                        {pred.geminiReport.risks.map((r, i) => (
                          <div key={i} className="p-3 rounded-xl border bg-rose-500/5 border-rose-500/10 flex gap-3 items-start">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full shrink-0 bg-rose-500" />
                            <p className="text-sm text-foreground/85 leading-relaxed">{r}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Analist Sonucu */}
                  <div className="bg-secondary/15 border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-all">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Bot className="w-4 h-4" /> Analist Sonucu
                    </h3>
                    <p className="text-sm text-foreground/80 leading-relaxed italic">{pred.geminiReport.analystConclusion}</p>
                  </div>
                </div>
              ) : (
                /* Fallback: Gemini raporu yoksa basit özet göster */
                <div className="bg-secondary/15 border border-border/50 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Analiz Özeti
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{pred.reason}</p>
                  {chartData.length > 0 && (
                    <div className="mt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                          <XAxis dataKey="date" tick={{ fontSize: 8 }} interval={14} stroke="#64748b" />
                          <YAxis tick={{ fontSize: 8 }} domain={['auto', 'auto']} stroke="#64748b" />
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
                          {forecastStart && <ReferenceLine x={forecastStart} stroke="#f59e0b" strokeDasharray="4 4" />}
                          <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fill="url(#gradHistory)" dot={false} />
                          <Area type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" fill="url(#gradForecast)" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}



              {/* Predictions */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Activity className="w-4 h-4" /> AI Fiyat Tahminleri ({asset.currencySymbol})</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: '1 Hafta', change: pred.w1, price: pred.w1P }, { label: '1 Ay', change: pred.m1, price: pred.m1P }, { label: '3 Ay', change: pred.m3, price: pred.m3P }].map((p, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                      <span className="text-xs text-muted-foreground mb-1">{p.label}</span>
                      <span className="font-bold text-lg">{asset.currencySymbol}{p.price.toLocaleString(asset.currencySymbol === '₺' ? 'tr-TR' : 'en-US', { maximumFractionDigits: asset.currencySymbol === '₺' ? 2 : 4 })}</span>
                      <span className={`text-xs font-bold mt-1 ${p.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{p.change >= 0 ? '+' : ''}{p.change.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-3">* Bu tahminler yapay zeka modelinin simülasyonudur ve yatırım tavsiyesi (YTD) içermez.</p>
              </div>

              {/* News */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Newspaper className="w-4 h-4" /> Taranan Son Haberler
                  {isNewsLive ? <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] rounded-full font-bold"><Wifi className="w-3 h-3" /> CANLI</span>
                  : <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] rounded-full font-bold"><WifiOff className="w-3 h-3" /> SİMÜLASYON</span>}
                </h3>
                <div className="space-y-2">
                  {news.map((item) => (
                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="bg-secondary/30 rounded-xl p-3 text-sm flex gap-3 group hover:bg-secondary/50 transition-colors cursor-pointer block">
                      <div className={`w-1.5 rounded-full shrink-0 ${item.isLive ? 'bg-emerald-500' : 'bg-primary/50'}`}></div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">{item.title}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="font-semibold text-primary/70 flex items-center gap-1">{item.source}<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></span>
                          {item.exactDate && <span className="text-muted-foreground/60">{item.exactDate}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
