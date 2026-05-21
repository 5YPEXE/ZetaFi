import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
// Netlify timeout sorununu çözmek için maksimum süre
export const maxDuration = 30;

const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 dakika

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYMBOL_TO_CG_ID: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin', XRP: 'ripple',
  ADA: 'cardano', DOGE: 'dogecoin', AVAX: 'avalanche-2', DOT: 'polkadot', TRX: 'tron',
  LINK: 'chainlink', MATIC: 'matic-network', SHIB: 'shiba-inu', LTC: 'litecoin', UNI: 'uniswap',
  ATOM: 'cosmos', XLM: 'stellar', NEAR: 'near', APT: 'aptos', SUI: 'sui',
  AAVE: 'aave', ICP: 'internet-computer', FIL: 'filecoin', ARB: 'arbitrum', OP: 'optimism',
  INJ: 'injective-protocol', RENDER: 'render-token', FET: 'fetch-ai', PEPE: 'pepe', WIF: 'dogwifcoin',
};

interface TechnicalMetrics {
  trendScore: number;
  trendDir: string;
  rsiLabel: string;
  rsiValue: number;
  forecastPct: number;
  forecastDir: string;
  change24h: number;
  currentPrice: number;
  currencySymbol: string;
  name: string;
}

async function fetchPriceHistory(symbol: string) {
  const cgId = SYMBOL_TO_CG_ID[symbol.toUpperCase()];
  if (!cgId) return null;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=30&interval=daily`,
      { signal: AbortSignal.timeout(6000), cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json() as Promise<{ prices: [number, number][] }>;
  } catch { return null; }
}

function buildPriceSummary(history: { prices: [number, number][] }): string {
  const prices = history.prices.map(([, p]) => p);
  if (prices.length < 2) return 'Geçmiş fiyat verisi yetersiz.';
  const first = prices[0], last = prices[prices.length - 1], mid = prices[Math.floor(prices.length / 2)];
  const max = Math.max(...prices), min = Math.min(...prices);
  const change30d = (((last - first) / first) * 100).toFixed(2);
  const change15d = (((last - mid) / mid) * 100).toFixed(2);
  const last7 = prices.slice(-7);
  const upDays = last7.filter((p, i) => i > 0 && p > last7[i - 1]).length;
  const downDays = last7.filter((p, i) => i > 0 && p < last7[i - 1]).length;
  const trendText = upDays >= 5 ? 'Güçlü yükseliş' : downDays >= 5 ? 'Güçlü düşüş'
    : upDays > downDays ? 'Hafif yükseliş' : downDays > upDays ? 'Hafif düşüş' : 'Yatay/kararsız';
  return [
    `30 gün önce: $${first.toFixed(2)}`,
    `15 gün önce: $${mid.toFixed(2)}`,
    `Bugün: $${last.toFixed(2)}`,
    `30G değişim: %${change30d} | 15G değişim: %${change15d}`,
    `30G en yüksek: $${max.toFixed(2)} | en düşük: $${min.toFixed(2)}`,
    `Son 7 gün: ${trendText} (${upDays} yükseliş / ${downDays} düşüş günü)`,
  ].join('\n');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { headlines, symbol, technicalMetrics, requestedBy, forceRefresh } = body as {
      headlines: string[];
      symbol: string;
      technicalMetrics?: TechnicalMetrics;
      requestedBy?: string;
      forceRefresh?: boolean;
    };

    if (!headlines || headlines.length === 0) {
      return NextResponse.json({ score: 0, reasoning: 'Haber bulunamadı.', report: null });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API anahtarı bulunamadı.' }, { status: 400 });
    }

    // ── 1. CACHE KONTROLÜ ─────────────────────────────────────────
    if (!forceRefresh) {
      const cutoff = new Date(Date.now() - CACHE_DURATION_MS).toISOString();
      const { data: cached } = await supabase
        .from('ai_analysis_cache')
        .select('*')
        .eq('symbol', symbol.toUpperCase())
        .gte('created_at', cutoff)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (cached) {
        return NextResponse.json({
          ...cached.analysis,
          fromCache: true,
          cachedBy: cached.requested_by,
          cachedAt: cached.created_at,
        });
      }
    }

    // ── 2. GEMİNİ API ÇAĞRISI ─────────────────────────────────────
    const priceHistory = await fetchPriceHistory(symbol);
    const hasPriceData = !!priceHistory && priceHistory.prices.length > 0;
    const priceSummary = hasPriceData
      ? buildPriceSummary(priceHistory!)
      : 'Bu varlık için geçmiş fiyat verisi mevcut değil.';

    const tm = technicalMetrics;
    const fullReportMode = !!tm;

    // Haberleri sadece ilk 10'a limitleyerek prompt boyutunu azalt
    const limitedHeadlines = headlines.slice(0, 10);

    const prompt = fullReportMode ? `
Sen kurumsal düzeyde bir finansal analist yapay zekasısın.
Aşağıdaki veri kaynaklarını bütünleşik olarak analiz et ve profesyonel bir rapor üret.

VARLIK: ${tm!.name} (${symbol}) | FİYAT: ${tm!.currencySymbol}${tm!.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 4 })} | 24S: ${tm!.change24h >= 0 ? '+' : ''}${tm!.change24h.toFixed(2)}%

📰 HABERLER (${limitedHeadlines.length} adet):
${limitedHeadlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}

📊 30 GÜNLÜK FİYAT:
${priceSummary}

📈 TEKNİK GÖSTERGELER:
- Trend: ${tm!.trendDir} (skor: ${tm!.trendScore > 0 ? '+' : ''}${tm!.trendScore})
- RSI (14): ${tm!.rsiLabel} (~${tm!.rsiValue})
- Holt-Winters Projeksiyonu: ${tm!.forecastPct >= 0 ? '+' : ''}${tm!.forecastPct.toFixed(1)}% → ${tm!.forecastDir}

TALİMATLAR: Haber tonu, fiyat hareketi ve teknik göstergeleri sentezle. Çelişkili sinyaller varsa ⚠️ ile belirt.

SADECE JSON DÖNDÜR:
{
  "score": <-100 ile +100>,
  "posCount": <sayı>,
  "negCount": <sayı>,
  "neutralCount": <sayı>,
  "priceSignal": <"Haberlerle Uyumlu" | "Haberlerle Çelişiyor" | "Veri Yok">,
  "report": {
    "marketOutlook": "<2-3 cümle genel görünüm>",
    "integratedAnalysis": "<3-4 cümle bütünleşik analiz, çelişki varsa ⚠️ ile>",
    "catalysts": ["<katalizör 1>", "<katalizör 2>", "<katalizör 3>"],
    "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
    "analystConclusion": "<2-3 cümle kesin analist sonucu, yatırım tavsiyesi olmadığını belirt>"
  }
}` : `
Sen finansal analist AI'sın. ${symbol} için haberleri analiz et, -100/+100 arası puan ver.
Haberler: ${limitedHeadlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}
${hasPriceData ? `30G Fiyat: ${priceSummary}` : ''}
SADECE JSON: {"score":<sayı>,"posCount":<sayı>,"negCount":<sayı>,"neutralCount":<sayı>,"priceSignal":"Veri Yok","report":null}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
        }),
        signal: AbortSignal.timeout(25000), // 25 saniye timeout
      }
    );

    if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`);

    const data = await res.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error('Gemini boş yanıt döndürdü');

    const parsed = JSON.parse(responseText);

    const result = {
      score: parsed.score || 0,
      pos: parsed.posCount || 0,
      neg: parsed.negCount || 0,
      neutral: parsed.neutralCount || 0,
      priceSignal: parsed.priceSignal || 'Veri Yok',
      report: parsed.report || null,
      hasPriceData,
      fromCache: false,
      cachedBy: null,
      cachedAt: null,
    };

    // ── 3. SUPABASE'E KAYDET ──────────────────────────────────────
    const displayName = requestedBy || 'Anonim';
    await supabase.from('ai_analysis_cache').insert({
      symbol: symbol.toUpperCase(),
      analysis: result,
      requested_by: displayName,
    }).then(({ error }) => {
      if (error) console.warn('Cache kaydetme hatası:', error.message);
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Sentiment API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
