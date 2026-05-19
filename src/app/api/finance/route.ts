import { NextResponse } from 'next/server';

// TradingView Scanner API - Ücretsiz, güvenilir, sunucu tarafından çalışır
async function fetchTradingView(market: string, body: object) {
  const res = await fetch(`https://scanner.tradingview.com/${market}/scan`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store'
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`TradingView ${market} error: ${res.status} - ${text.slice(0, 200)}`);
    throw new Error(`TradingView ${market} failed: ${res.status}`);
  }
  return res.json();
}

// Emtia: Altın/Gümüş -> cfd market, Petrol/Platin/Paladyum/Bakır -> futures market
const COMMODITY_CFD: Record<string, string> = { 'xau': 'TVC:GOLD', 'xag': 'TVC:SILVER' };
const COMMODITY_FUTURES: Record<string, string> = { 'brent': 'NYMEX:BZ1!', 'xpt': 'NYMEX:PL1!', 'xpd': 'NYMEX:PA1!', 'cop': 'COMEX:HG1!' };
const COINGECKO_IDS = [
  'bitcoin','ethereum','solana','binancecoin','ripple','cardano','dogecoin','avalanche-2','polkadot','tron',
  'chainlink','matic-network','shiba-inu','litecoin','uniswap','cosmos','stellar','near','aptos','sui',
  'aave','internet-computer','filecoin','arbitrum','optimism','injective-protocol','render-token','fetch-ai','pepe','dogwifcoin'
];

const CG_SYMBOL_MAP: Record<string, string> = {
  'bitcoin':'BTC','ethereum':'ETH','solana':'SOL','binancecoin':'BNB','ripple':'XRP',
  'cardano':'ADA','dogecoin':'DOGE','avalanche-2':'AVAX','polkadot':'DOT','tron':'TRX',
  'chainlink':'LINK','matic-network':'MATIC','shiba-inu':'SHIB','litecoin':'LTC','uniswap':'UNI',
  'cosmos':'ATOM','stellar':'XLM','near':'NEAR','aptos':'APT','sui':'SUI',
  'aave':'AAVE','internet-computer':'ICP','filecoin':'FIL','arbitrum':'ARB','optimism':'OP',
  'injective-protocol':'INJ','render-token':'RENDER','fetch-ai':'FET','pepe':'PEPE','dogwifcoin':'WIF'
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Tüm verileri paralel çek (5 istek aynı anda)
    const [bistRes, fxRes, cfdRes, futuresRes, cgRes] = await Promise.allSettled([
      // BIST100: Piyasa değerine göre en büyük 100 hisse (dinamik!)
      fetchTradingView('turkey', {
        filter: [{ left: 'exchange', operation: 'equal', right: 'BIST' }],
        symbols: { query: { types: ['stock'] } },
        columns: ['close', 'change', 'description', 'market_cap_basic'],
        sort: { sortBy: 'market_cap_basic', sortOrder: 'desc' },
        range: [0, 100]
      }),
      // USD/TRY Kuru
      fetchTradingView('forex', {
        symbols: { tickers: ['FX_IDC:USDTRY'], query: { types: [] } },
        columns: ['close', 'change']
      }),
      // Emtia: CFD (Altın, Gümüş)
      fetchTradingView('cfd', {
        symbols: { tickers: Object.values(COMMODITY_CFD), query: { types: [] } },
        columns: ['close', 'change']
      }),
      // Emtia: Futures (Petrol, Platin, Paladyum, Bakır)
      fetchTradingView('futures', {
        symbols: { tickers: Object.values(COMMODITY_FUTURES), query: { types: [] } },
        columns: ['close', 'change']
      }),
      // Kripto: CoinGecko (cloud-friendly, no IP blocking)
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINGECKO_IDS.join(',')}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`,
        { cache: 'no-store', signal: AbortSignal.timeout(8000) }
      ).then(r => r.json())
    ]);

    // 1. USD/TRY Kuru
    let usdRate = 38.5;
    if (fxRes.status === 'fulfilled' && fxRes.value?.data?.[0]) {
      usdRate = fxRes.value.data[0].d[0] || 38.5;
    }

    // 2. BIST100 Hisseleri (Dinamik — piyasa değerine göre sıralı)
    const bist: any[] = [];
    if (bistRes.status === 'fulfilled' && bistRes.value?.data) {
      for (const item of bistRes.value.data) {
        const symbol = item.s.replace('BIST:', '');
        bist.push({
          symbol,
          name: item.d[2] || symbol,
          price: item.d[0] || 0,
          change: item.d[1] || 0,
          marketCap: item.d[3] || 0
        });
      }
    }

    // 3. Emtialar (CFD + Futures birleştir)
    const commodities: any[] = [];
    const cfdTickerToId = Object.fromEntries(Object.entries(COMMODITY_CFD).map(([k, v]) => [v, k]));
    const futuresTickerToId = Object.fromEntries(Object.entries(COMMODITY_FUTURES).map(([k, v]) => [v, k]));

    if (cfdRes.status === 'fulfilled' && cfdRes.value?.data) {
      for (const item of cfdRes.value.data) {
        const id = cfdTickerToId[item.s];
        if (!id) continue;
        let priceUsd = item.d[0] || 0;
        if (id === 'xau' || id === 'xag') priceUsd = priceUsd / 31.1035;
        commodities.push({ id, priceUsd, priceTry: priceUsd * usdRate, change: item.d[1] || 0 });
      }
    }

    if (futuresRes.status === 'fulfilled' && futuresRes.value?.data) {
      for (const item of futuresRes.value.data) {
        const id = futuresTickerToId[item.s];
        if (!id) continue;
        let priceUsd = item.d[0] || 0;
        if (id === 'xpt' || id === 'xpd') priceUsd = priceUsd / 31.1035;
        if (id === 'cop') priceUsd = priceUsd / 0.453592;
        commodities.push({ id, priceUsd, priceTry: priceUsd * usdRate, change: item.d[1] || 0 });
      }
    }

    // 4. Kripto (CoinGecko)
    const crypto: any[] = [];
    if (cgRes.status === 'fulfilled' && Array.isArray(cgRes.value)) {
      for (const c of cgRes.value) {
        const symbol = CG_SYMBOL_MAP[c.id] || c.symbol.toUpperCase();
        crypto.push({
          symbol,
          price: c.current_price || 0,
          change: c.price_change_percentage_24h || 0,
          high24h: c.high_24h || 0,
          low24h: c.low_24h || 0,
          volume: c.total_volume || 0,
          marketCap: c.market_cap || 0
        });
      }
    }

    return NextResponse.json({
      status: 'success',
      usd_rate: usdRate,
      bist,
      commodities,
      crypto,
      timestamp: Date.now(),
      _debug: {
        bist: bistRes.status === 'fulfilled' ? `ok (${bist.length} hisse)` : `FAIL: ${(bistRes as any).reason}`,
        fx: fxRes.status === 'fulfilled' ? `ok (${usdRate})` : `FAIL: ${(fxRes as any).reason}`,
        cfd: cfdRes.status === 'fulfilled' ? 'ok' : `FAIL: ${(cfdRes as any).reason}`,
        futures: futuresRes.status === 'fulfilled' ? 'ok' : `FAIL: ${(futuresRes as any).reason}`,
        crypto: cgRes.status === 'fulfilled' ? `ok (${crypto.length} coin)` : `FAIL: ${(cgRes as any).reason}`
      }
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ status: 'error', message: String(error) }, { status: 500 });
  }
}
