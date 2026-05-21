import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
  const trendText = upDays >= 5 ? 'Güçlü yükseliş' : downDays >= 5 ? 'Güçlü düşüş' : upDays > downDays ? 'Hafif yükseliş' : downDays > upDays ? 'Hafif düşüş' : 'Yatay/kararsız';
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
    const { headlines, symbol, technicalMetrics } = body as {
      headlines: string[];
      symbol: string;
      technicalMetrics?: TechnicalMetrics;
    };

    if (!headlines || headlines.length === 0) {
      return NextResponse.json({ score: 0, reasoning: 'Haber bulunamadı.', report: null });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API anahtarı bulunamadı.' },
        { status: 400 }
      );
    }

    // Geçmiş fiyat verisini çek
    const priceHistory = await fetchPriceHistory(symbol);
    const hasPriceData = !!priceHistory && priceHistory.prices.length > 0;
    const priceSummary = hasPriceData
      ? buildPriceSummary(priceHistory!)
      : 'Bu varlık için geçmiş fiyat verisi mevcut değil (BIST hissesi veya emtia olabilir).';

    const tm = technicalMetrics;

    // Eğer teknik metrikler varsa → tam rapor üret
    // Eğer yoksa → sadece sentiment skoru üret (fallback)
    const fullReportMode = !!tm;

    const prompt = fullReportMode ? `
Sen kurumsal düzeyde bir finansal analist yapay zekasısın.
Aşağıdaki 4 veri kaynağını bütünleşik olarak analiz et ve profesyonel bir rapor üret.

═══════════════════════════════════
VARLIK: ${tm!.name} (${symbol})
GÜNCEL FİYAT: ${tm!.currencySymbol}${tm!.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 4 })}
24S DEĞİŞİM: ${tm!.change24h >= 0 ? '+' : ''}${tm!.change24h.toFixed(2)}%
═══════════════════════════════════

📰 HABER ANALİZİ (${headlines.length} haber):
${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}

📊 30 GÜNLÜK FİYAT HAREKETİ:
${priceSummary}

📈 TEKNİK GÖSTERGELER (önceden hesaplanmış):
- Teknik Trend: ${tm!.trendDir} (SMA10/SMA30 bazlı skor: ${tm!.trendScore > 0 ? '+' : ''}${tm!.trendScore})
- RSI (14): ${tm!.rsiLabel} (değer: ~${tm!.rsiValue})
- İstatistiksel Projeksiyon (Holt-Winters Damped Trend): ${tm!.forecastPct >= 0 ? '+' : ''}${tm!.forecastPct.toFixed(1)}% → ${tm!.forecastDir}

═══════════════════════════════════
ANALİZ TALİMATLARI:
1. Haber tonunu değerlendir: Haberler genel olarak ne söylüyor?
2. Fiyat hareketini değerlendir: 30 günlük trend ne yönde?
3. Teknik durumu değerlendir: RSI ve trend birbirini destekliyor mu?
4. İstatistiksel modelin öngörüsünü değerlendir.
5. Tüm bunları SENTEZLEYEREk tek bir bütünsel görüş oluştur.
6. Çelişkili sinyaller varsa mutlaka belirt (örn: haberler pozitif ama fiyat düşüyorsa).
7. Raporu TÜM TÜRK FİNANS YATIRIMCILARI için profesyonel ama anlaşılır bir dilde yaz.

SADECE VE SADECE AŞAĞIDAKİ JSON FORMATINDA YANIT VER:
{
  "score": <-100 ile +100 arası sayı, 0=nötr>,
  "posCount": <pozitif haber sayısı>,
  "negCount": <negatif haber sayısı>,
  "neutralCount": <nötr haber sayısı>,
  "priceSignal": <"Haberlerle Uyumlu" | "Haberlerle Çelişiyor" | "Veri Yok">,
  "report": {
    "marketOutlook": "<Genel piyasa görünümü: 2-3 cümle. Boğa/Ayı/Nötr yönü ve sebebi.>",
    "integratedAnalysis": "<Haber duygusu + fiyat hareketi + teknik göstergeler + istatistiksel model BİRLİKTE yorumlanmış 3-4 cümle. Çelişkili sinyaller varsa ⚠️ ile belirt.>",
    "catalysts": ["<katalizör 1>", "<katalizör 2>", "<katalizör 3>"],
    "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
    "analystConclusion": "<Analist sonucu: tüm faktörleri özetleyen, kesin bir görüş bildiren 2-3 cümle. Yatırım tavsiyesi olmadığını belirt.>"
  }
}
` : `
Sen kurumsal bir finansal analist AI'sın. Aşağıdaki haber başlıklarını ${symbol} varlığı için analiz et.
Piyasa üzerindeki etkisini -100 ile +100 arasında puanla.

Haberler:
${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}

${hasPriceData ? `30 Günlük Fiyat Hareketi:\n${priceSummary}` : ''}

SADECE JSON FORMATINDA YANIT VER:
{
  "score": <sayı>,
  "posCount": <sayı>,
  "negCount": <sayı>,
  "neutralCount": <sayı>,
  "priceSignal": <"Haberlerle Uyumlu" | "Haberlerle Çelişiyor" | "Veri Yok">,
  "reasoning": "<2 cümlelik yorum>"
}
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.25, responseMimeType: 'application/json' },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`);

    const data = await res.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error('Gemini API returned empty text');

    const parsed = JSON.parse(responseText);

    return NextResponse.json({
      score: parsed.score || 0,
      pos: parsed.posCount || 0,
      neg: parsed.negCount || 0,
      neutral: parsed.neutralCount || 0,
      priceSignal: parsed.priceSignal || 'Veri Yok',
      reasoning: parsed.reasoning || parsed.report?.integratedAnalysis || '',
      report: parsed.report || null,
      hasPriceData,
    });

  } catch (error) {
    console.error('Sentiment API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
