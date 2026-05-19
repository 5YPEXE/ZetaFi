import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem } from '../hooks/useFinanceData';
import { RefreshCw, TrendingUp, TrendingDown, Search, X, Pickaxe, Building2, Coins, DollarSign, Bot } from 'lucide-react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import AIAnalyzerModal from './AIAnalyzerModal';

const STOCK_COLORS = ['#e11d48', '#0284c7', '#16a34a', '#0f766e', '#b91c1c', '#1d4ed8', '#dc2626', '#475569', '#2563eb', '#ea580c', '#0369a1', '#1e3a8a', '#7c3aed', '#059669', '#d97706', '#be185d', '#4f46e5', '#0891b2', '#65a30d', '#c026d3'];

const BASE_CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
  { id: 'tron', symbol: 'TRX', name: 'TRON', image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', image: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', image: 'https://assets.coingecko.com/coins/images/12504/large/uni.jpg' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', image: 'https://assets.coingecko.com/coins/images/10365/large/near.jpg' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', image: 'https://assets.coingecko.com/coins/images/26455/large/aptos_round.png' },
  { id: 'sui', symbol: 'SUI', name: 'Sui', image: 'https://assets.coingecko.com/coins/images/26375/large/sui-ocean-square.png' },
  { id: 'aave', symbol: 'AAVE', name: 'Aave', image: 'https://assets.coingecko.com/coins/images/12645/large/aave-token-round.png' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', image: 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', image: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', image: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', image: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png' },
  { id: 'injective-protocol', symbol: 'INJ', name: 'Injective', image: 'https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png' },
  { id: 'render-token', symbol: 'RENDER', name: 'Render', image: 'https://assets.coingecko.com/coins/images/11636/large/rndr.png' },
  { id: 'fetch-ai', symbol: 'FET', name: 'Fetch.ai', image: 'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg' },
  { id: 'dogwifcoin', symbol: 'WIF', name: 'dogwifhat', image: 'https://assets.coingecko.com/coins/images/33566/large/dogwifhat.jpg' },
];

const MOCK_COMMODITIES = [
  { id: 'xau', symbol: 'XAU/TRY', name: 'Gram Altın', basePrice: 2450, color: '#eab308', imageUrl: 'https://img.icons8.com/color/96/gold-bars.png' },
  { id: 'xag', symbol: 'XAG/TRY', name: 'Gümüş', basePrice: 32, color: '#94a3b8', imageUrl: 'https://img.icons8.com/color/96/silver-bars.png' },
  { id: 'xpt', symbol: 'XPT/TRY', name: 'Platin', basePrice: 1050, color: '#cbd5e1', imageUrl: 'https://img.icons8.com/color/96/diamond.png' },
  { id: 'xpd', symbol: 'XPD/TRY', name: 'Paladyum', basePrice: 1100, color: '#64748b', imageUrl: 'https://img.icons8.com/color/96/ring.png' },
  { id: 'cop', symbol: 'COPPER', name: 'Bakır', basePrice: 150, color: '#b45309', imageUrl: 'https://img.icons8.com/color/96/copper.png' },
  { id: 'brent', symbol: 'BRENT', name: 'Brent Petrol', basePrice: 2700, color: '#1e293b', imageUrl: 'https://img.icons8.com/color/96/oil-industry.png' }
];

// Helper to generate a realistic looking sparkline ending at current price (60 data points for better forecasting)
const generateMockSparkline = (currentPrice: number, volatility: number = 0.05) => {
  const data = [];
  let price = currentPrice * (1 - volatility * 1.5);
  for (let i = 0; i < 60; i++) {
    price = price * (1 + (Math.random() - 0.48) * volatility);
    data.push({ value: price });
  }
  data.push({ value: currentPrice });
  return data;
};

// Generates a random color for cryptos
const getRandomColor = () => {
  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#22c55e', '#0ea5e9', '#6366f1', '#eab308', '#e11d48', '#8b5cf6', '#ec4899'];
  return colors[Math.floor(Math.random() * colors.length)];
};

type Asset = {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  priceTry: number;
  change24h: number;
  color: string;
  imageUrl?: string;
  volume?: number;
  high24h?: number;
  low24h?: number;
  trades?: number;
};

export default function InvestmentsTab({
  portfolio,
  onBuyCrypto,
  onSellCrypto,
  totalBalance
}: {
  portfolio: PortfolioItem[];
  onBuyCrypto: (id: string, symbol: string, name: string, price: number, amount: number) => void;
  onSellCrypto: (id: string, name: string, amountToSell: number, currentPrice: number) => Promise<boolean> | boolean;
  totalBalance: number;
}) {
  const [cryptos, setCryptos] = useState<Asset[]>([]);
  const [stocks, setStocks] = useState<Asset[]>([]);
  const [commodities, setCommodities] = useState<Asset[]>([]);
  const [sparklines, setSparklines] = useState<Record<string, { value: number }[]>>({});
  const [usdRate, setUsdRate] = useState(32.5);

  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<'try' | 'usd'>('try');
  const [activeCategory, setActiveCategory] = useState<'crypto' | 'stocks' | 'commodities'>('crypto');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetToAnalyze, setAssetToAnalyze] = useState<Asset | null>(null);
  const [modalAction, setModalAction] = useState<'buy' | 'sell'>('buy');
  const [inputAmount, setInputAmount] = useState('');

  const loadData = async (isFirstLoad: boolean = false) => {
    if (isFirstLoad) setIsLoading(true);
    let currentUsdRate = usdRate;

    try {
      const res = await fetch('/api/finance', { cache: 'no-store' });
      if (res.ok) {
        const apiData = await res.json();
        
        if (apiData.status === 'success') {
          currentUsdRate = apiData.usd_rate || 38.5;
          setUsdRate(currentUsdRate);

          const { crypto } = apiData;
          const newCryptos: Asset[] = BASE_CRYPTOS.map(bc => {
            const cData = crypto.find((c: any) => c.symbol === bc.symbol);
            const priceUsd = cData?.price || 0;
            return {
              id: bc.id, symbol: bc.symbol, name: bc.name,
              priceUsd, priceTry: priceUsd * currentUsdRate,
              change24h: cData?.change || 0, color: getRandomColor(), imageUrl: bc.image,
              volume: cData?.volume || 0, high24h: cData?.high24h || 0, low24h: cData?.low24h || 0, trades: cData?.trades || 0
            };
          });
          setCryptos(newCryptos);

          if (isFirstLoad) {
            const firstSparklines: Record<string, { value: number }[]> = {};
            newCryptos.forEach(c => { firstSparklines[c.id] = generateMockSparkline(c.priceTry, 0.1); });
            setSparklines(prev => ({ ...prev, ...firstSparklines }));
          }
        }
      }
    } catch (error) {
      console.error("Finance API Error:", error);
    }

    // 3. BIST100 (SİMULASYON MODU - Sabitlenmiş Başlangıç Verileri)
    const SIM_BIST100 = [
      { s: 'THYAO', n: 'Türk Hava Yolları', p: 294.50, c: 1.25 },
      { s: 'ASELS', n: 'Aselsan', p: 62.15, c: 2.10 },
      { s: 'EREGL', n: 'Erdemir', p: 48.30, c: -0.85 },
      { s: 'KCHOL', n: 'Koç Holding', p: 182.40, c: 0.45 },
      { s: 'TUPRS', n: 'Tüpraş', p: 164.20, c: 1.15 },
      { s: 'SAHOL', n: 'Sabancı Holding', p: 85.10, c: -1.20 },
      { s: 'SISE', n: 'Şişecam', p: 51.40, c: 0.30 },
      { s: 'AKBNK', n: 'Akbank', p: 44.20, c: 2.50 },
      { s: 'GARAN', n: 'Garanti BBVA', p: 78.40, c: 1.80 },
      { s: 'BIMAS', n: 'BİM Mağazalar', p: 392.00, c: -0.50 },
      { s: 'SASA', n: 'Sasa Polyester', p: 38.40, c: -3.10 },
      { s: 'HEKTS', n: 'Hektaş', p: 15.20, c: -2.40 },
      { s: 'YKBNK', n: 'Yapı Kredi', p: 28.15, c: 1.65 },
      { s: 'ISCTR', n: 'İş Bankası (C)', p: 13.40, c: 0.90 },
      { s: 'FROTO', n: 'Ford Otosan', p: 1045.00, c: 0.75 },
      { s: 'TOASO', n: 'Tofaş Oto', p: 265.50, c: -0.20 },
      { s: 'PETKM', n: 'Petkim', p: 21.80, c: 0.40 },
      { s: 'PGSUS', n: 'Pegasus', p: 845.00, c: 2.80 },
    ];

    if (stocks.length === 0) {
      const initialStocks: Asset[] = SIM_BIST100.map((item, idx) => {
        const id = item.s.toLowerCase();
        return {
          id, symbol: item.s, name: item.n,
          priceTry: item.p, priceUsd: item.p / currentUsdRate,
          change24h: item.c,
          color: STOCK_COLORS[idx % STOCK_COLORS.length],
          imageUrl: `https://www.google.com/s2/favicons?sz=128&domain=${item.s.toLowerCase()}.com.tr`
        };
      });
      setStocks(initialStocks);
      const stockSparklines: Record<string, { value: number }[]> = {};
      initialStocks.forEach(s => { stockSparklines[s.id] = generateMockSparkline(s.priceTry, 0.05); });
      setSparklines(prev => ({ ...prev, ...stockSparklines }));
    }

    // 4. Emtia (SİMULASYON MODU)
    if (commodities.length === 0) {
      const SIM_COMMODITIES = [
        { id: 'xau', name: 'Gram Altın', p: 2485.50, c: 0.45 },
        { id: 'xag', name: 'Gümüş', p: 31.85, c: 1.20 },
        { id: 'brent', name: 'Brent Petrol', p: 84.20, c: -0.65 },
        { id: 'xpt', name: 'Platin', p: 985.00, c: 0.15 },
        { id: 'xpd', name: 'Paladyum', p: 1045.00, c: -1.40 },
        { id: 'cop', name: 'Bakır', p: 4.25, c: 0.80 },
      ];
      const initialCmds = MOCK_COMMODITIES.map(mc => {
        const sim = SIM_COMMODITIES.find(s => s.id === mc.id);
        const priceTry = sim ? sim.p : mc.basePrice;
        return { ...mc, priceTry, priceUsd: priceTry / currentUsdRate, change24h: sim?.c || 0 };
      });
      setCommodities(initialCmds);
      const cmdSparklines: Record<string, { value: number }[]> = {};
      initialCmds.forEach(c => { cmdSparklines[c.id] = generateMockSparkline(c.priceTry, 0.03); });
      setSparklines(prev => ({ ...prev, ...cmdSparklines }));
    }

    if (isFirstLoad) setIsLoading(false);
  };

  useEffect(() => {
    loadData(true);
    // Her 30 saniyede bir gerçek verileri tazele
    const interval = setInterval(() => loadData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  // Micro-Tick Simulation (Makes numbers "play" live)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      const tick = (val: number, volatility: number = 0.0005) => val * (1 + (Math.random() - 0.5) * volatility);

      setCryptos(prev => prev.map(c => ({ ...c, priceUsd: tick(c.priceUsd), priceTry: tick(c.priceTry) })));
      setStocks(prev => prev.map(s => ({ ...s, priceTry: tick(s.priceTry), priceUsd: tick(s.priceUsd) })));
      setCommodities(prev => prev.map(c => ({ ...c, priceTry: tick(c.priceTry), priceUsd: tick(c.priceUsd) })));
    }, 2000); // Her 2 saniyede bir ufak oynama

    return () => clearInterval(tickInterval);
  }, []);


  // Derived Values
  const currencySymbol = currency === 'try' ? '₺' : '$';
  const displayBalance = currency === 'try' ? totalBalance : totalBalance / usdRate;

  // Global Price Lookup Helper
  const getAssetPrice = (id: string, curr: 'try' | 'usd') => {
    const asset = [...cryptos, ...stocks, ...commodities].find(a => a.id === id);
    if (!asset) return 0;
    return curr === 'try' ? asset.priceTry : asset.priceUsd;
  };

  const totalPortfolioValue = portfolio.reduce((acc, item) => {
    return acc + (item.amount * getAssetPrice(item.coinId, currency));
  }, 0);

  // Active List Filtering
  const activeList = useMemo(() => {
    let list = cryptos;
    if (activeCategory === 'stocks') list = stocks;
    if (activeCategory === 'commodities') list = commodities;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, cryptos, stocks, commodities, searchQuery]);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !inputAmount) return;

    const amountNum = parseFloat(inputAmount);
    let amountInTry = amountNum;
    if (currency === 'usd') amountInTry = amountNum * usdRate;

    const currentPriceTry = selectedAsset.priceTry;

    if (modalAction === 'buy') {
      if (amountInTry > totalBalance) {
        alert("Yetersiz bakiye! Ana bakiyenizden daha fazla alım yapamazsınız.");
        return;
      }
      onBuyCrypto(selectedAsset.id, selectedAsset.symbol, selectedAsset.name, currentPriceTry, amountInTry);
    } else {
      const item = portfolio.find(p => p.coinId === selectedAsset.id);
      if (!item) return;

      const currentPrice = getAssetPrice(selectedAsset.id, currency);
      const amountOfCoinToSell = amountNum / currentPrice;

      if (amountOfCoinToSell > item.amount) {
        alert("Sahip olduğunuzdan daha fazla satamazsınız!");
        return;
      }
      onSellCrypto(selectedAsset.id, selectedAsset.name, amountOfCoinToSell, currentPriceTry);
    }

    setSelectedAsset(null);
    setInputAmount('');
  };

  const openModal = (asset: Asset, action: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setModalAction(action);
    setInputAmount('');
  };

  // Derived portfolio stats
  const totalCost = portfolio.reduce((acc, item) => acc + (item.amount * item.averageBuyPrice), 0);
  const totalCostDisplay = currency === 'try' ? totalCost : totalCost / usdRate;
  const totalPnL = totalPortfolioValue - totalCostDisplay;
  const totalPnLPct = totalCostDisplay > 0 ? (totalPnL / totalCostDisplay) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Portföyüm & Piyasalar</h2>
        <div className="flex items-center gap-2">
          <div className="bg-secondary p-1 rounded-xl flex items-center">
            <button onClick={() => setCurrency('try')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === 'try' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>TRY</button>
            <button onClick={() => setCurrency('usd')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === 'usd' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>USD</button>
          </div>
          <button onClick={() => loadData(true)} disabled={isLoading} className="p-2 bg-secondary rounded-xl hover:bg-border transition-colors">
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>

      {/* ── Portfolio Summary Header ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Total value */}
        <div className="sm:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5"><DollarSign className="w-40 h-40" /></div>
          <div className="relative z-10">
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Toplam Portföy Değeri</div>
            <div className="text-4xl font-bold tabular-nums mb-3">
              {currencySymbol}{totalPortfolioValue.toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-xs text-muted-foreground">
                Toplam Maliyet: <span className="font-bold text-foreground">{currencySymbol}{totalCostDisplay.toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                totalPnL >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              }`}>
                {totalPnL >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {totalPnL >= 0 ? '+' : ''}{currencySymbol}{Math.abs(totalPnL).toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalPnLPct >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
        {/* Available cash */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Kullanılabilir Nakit</div>
          <div className="text-2xl font-bold tabular-nums text-primary">
            {currencySymbol}{displayBalance.toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Ana bakiye — yatırıma hazır</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Varlıklarım (Sol Kolon) */}
        <div className="xl:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Sahip Olduklarım
            <span className="ml-2 text-xs font-normal text-muted-foreground">{portfolio.length} varlık</span>
          </h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar">
            {portfolio.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Henüz yatırım yok</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Piyasalardan varlık satın al</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {portfolio.map(item => {
                  const currentPrice = getAssetPrice(item.coinId, currency);
                  const totalValue = item.amount * currentPrice;
                  const avgBuyDisplay = currency === 'try' ? item.averageBuyPrice : item.averageBuyPrice / usdRate;
                  const costBasis = item.amount * avgBuyDisplay;
                  const pnlAbs = totalValue - costBasis;
                  const pnlPct = costBasis > 0 ? (pnlAbs / costBasis) * 100 : 0;
                  const isGain = pnlPct >= 0;
                  // Find the asset for analyze/sell actions
                  const assetObj = [...cryptos, ...stocks, ...commodities].find(a => a.id === item.coinId);

                  // Format amount nicely
                  const fmtAmount = item.amount >= 1 
                    ? item.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })
                    : item.amount.toLocaleString(undefined, { maximumSignificantDigits: 4 });

                  return (
                    <div key={item.coinId} className="p-4 hover:bg-secondary/30 transition-colors group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          {assetObj?.imageUrl ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex-shrink-0">
                              <img src={assetObj.imageUrl} alt={item.symbol} className="w-full h-full object-contain p-0.5" onError={e => { e.currentTarget.style.opacity='0'; }} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: assetObj?.color ?? '#64748b' }}>{item.symbol[0]}</div>
                          )}
                          <div>
                            <div className="font-bold text-sm">{item.symbol}</div>
                            <div className="text-[10px] text-muted-foreground tabular-nums">{fmtAmount} adet</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm tabular-nums">{currencySymbol}{totalValue.toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className={`text-xs font-bold tabular-nums ${isGain ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isGain ? '+' : ''}{currencySymbol}{Math.abs(pnlAbs).toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isGain ? '+' : ''}{pnlPct.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      {/* Avg buy price row */}
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                        <span>Ort. Alış: <span className="font-semibold text-foreground tabular-nums">{currencySymbol}{avgBuyDisplay.toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span></span>
                        <span>Güncel: <span className="font-semibold text-foreground tabular-nums">{currencySymbol}{currentPrice.toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span></span>
                      </div>
                      {/* P&L bar */}
                      <div className="w-full h-1 bg-border rounded-full mb-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isGain ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min(100, Math.abs(pnlPct) * 2)}%` }}
                        />
                      </div>
                      {/* Action buttons — visible on hover */}
                      {assetObj && (
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setAssetToAnalyze(assetObj)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            <Bot className="w-3 h-3" /> AI Analiz
                          </button>
                          <button
                            onClick={() => openModal(assetObj, 'sell')}
                            className="flex-1 py-1.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-lg hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            Sat
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Piyasalar (Sağ Kolon) */}
        <div className="xl:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Tüm Piyasalar</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[600px]">

            {/* Header & Tabs */}
            <div className="p-4 border-b border-border bg-secondary/30">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
                <div className="flex gap-2 w-full sm:w-auto bg-background p-1 rounded-xl">
                  <button onClick={() => setActiveCategory('crypto')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeCategory === 'crypto' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Coins className="w-4 h-4" /> Kripto
                  </button>
                  <button onClick={() => setActiveCategory('stocks')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeCategory === 'stocks' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Building2 className="w-4 h-4" /> BIST100
                  </button>
                  <button onClick={() => setActiveCategory('commodities')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeCategory === 'commodities' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Pickaxe className="w-4 h-4" /> Emtia
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`${activeCategory === 'crypto' ? 'Bitcoin, Ethereum' : activeCategory === 'stocks' ? 'THYAO, ASELS' : 'Altın, Gümüş'} ara...`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 divide-y divide-border">
              {isLoading ? (
                <div className="divide-y divide-border">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full skeleton flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 skeleton rounded w-20" />
                        <div className="h-2 skeleton rounded w-14" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 skeleton rounded w-16" />
                        <div className="h-2 skeleton rounded w-10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeList.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">Sonuç bulunamadı.</div>
              ) : (
                activeList.map(asset => {
                  const priceVal = currency === 'try' ? asset.priceTry : asset.priceUsd;
                  const priceStr = `${currencySymbol}${priceVal.toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: currency === 'try' ? 2 : 4 })}`;
                  const isPositive = asset.change24h >= 0;

                  return (
                    <div key={asset.id} className="p-4 grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-3 w-32 md:w-48">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: asset.color }}>
                          <span>{asset.symbol[0]}</span>
                          {asset.imageUrl && (
                            <img
                              src={asset.imageUrl}
                              alt={asset.symbol}
                              className="w-full h-full object-contain absolute inset-0 bg-white p-1 rounded-full"
                              onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                            />
                          )}
                        </div>
                        <div className="truncate">
                          <div className="font-bold truncate">{asset.symbol}</div>
                          <div className="text-xs text-muted-foreground truncate">{asset.name}</div>
                          {activeCategory === 'crypto' && asset.volume && asset.volume > 0 && (
                            <div className="text-[10px] text-primary/70 font-medium">
                              Vol: ${asset.volume >= 1e9 ? (asset.volume / 1e9).toFixed(1) + 'B' : asset.volume >= 1e6 ? (asset.volume / 1e6).toFixed(0) + 'M' : asset.volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mini Chart */}
                      <div className="h-10 w-full px-2 max-w-[120px] hidden md:block opacity-60 hover:opacity-100 transition-opacity min-h-[40px]">
                        {sparklines[asset.id] && (
                          <ResponsiveContainer width="100%" height={40}>
                            <LineChart data={sparklines[asset.id]}>
                              <YAxis domain={['dataMin', 'dataMax']} hide />
                              <Line type="monotone" dataKey="value" stroke={isPositive ? '#10b981' : '#f43f5e'} strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>

                      <div className="text-right flex flex-col items-end w-24 md:w-36">
                        <div className="font-bold whitespace-nowrap">{priceStr}</div>
                        <div className={`flex items-center text-xs font-bold whitespace-nowrap ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {Math.abs(asset.change24h).toFixed(2)}%
                        </div>
                        {activeCategory === 'crypto' && asset.high24h && asset.low24h && asset.high24h > 0 && (
                          <div className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
                            H: ${currency === 'try' ? (asset.high24h * usdRate).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : asset.high24h.toLocaleString('en-US', { maximumFractionDigits: 2 })} · L: ${currency === 'try' ? (asset.low24h * usdRate).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : asset.low24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <button onClick={() => setAssetToAnalyze(asset)} className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors" title="AI Analizi">
                          <Bot className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal(asset, 'buy')} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">Al</button>
                        <button onClick={() => openModal(asset, 'sell')} className="px-3 py-1.5 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-border transition-colors">Sat</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/50">
                <h3 className="font-bold">{selectedAsset.name} {modalAction === 'buy' ? 'Al' : 'Sat'}</h3>
                <button onClick={() => setSelectedAsset(null)} className="p-1 hover:bg-border rounded-full transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAction} className="p-6 space-y-4">
                {/* Asset price info */}
                <div className="bg-secondary/60 border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedAsset.imageUrl && (
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-white flex-shrink-0">
                        <img src={selectedAsset.imageUrl} alt={selectedAsset.symbol} className="w-full h-full object-contain p-0.5" onError={e => { e.currentTarget.style.opacity='0'; }} />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm">{selectedAsset.name}</div>
                      <div className={`text-xs font-bold ${selectedAsset.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}% (24s)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Güncel Fiyat</div>
                    <div className="text-lg font-black text-primary tabular-nums">
                      {currencySymbol}{getAssetPrice(selectedAsset.id, currency).toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { maximumFractionDigits: 4 })}
                    </div>
                  </div>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    {modalAction === 'buy' ? `Ne kadar harcamak istiyorsunuz? (${currency.toUpperCase()})` : `Ne kadar değerinde satmak istiyorsunuz? (${currency.toUpperCase()})`}
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputAmount}
                    onChange={e => setInputAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-xl font-black tabular-nums"
                  />

                  {/* Quick % buttons */}
                  <div className="flex gap-2 mt-2">
                    {modalAction === 'buy'
                      ? [25, 50, 75, 100].map(pct => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setInputAmount(((displayBalance * pct) / 100).toFixed(2))}
                            className="flex-1 py-1.5 text-[10px] font-bold bg-secondary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                          >%{pct}</button>
                        ))
                      : (() => {
                          const holdingItem = portfolio.find(p => p.coinId === selectedAsset.id);
                          const holdingValue = holdingItem ? holdingItem.amount * getAssetPrice(selectedAsset.id, currency) : 0;
                          return [25, 50, 75, 100].map(pct => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => setInputAmount(((holdingValue * pct) / 100).toFixed(2))}
                              className="flex-1 py-1.5 text-[10px] font-bold bg-secondary hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors"
                            >{pct === 100 ? 'Max' : `%${pct}`}</button>
                          ));
                        })()
                    }
                  </div>

                  {/* Coin quantity preview */}
                  {inputAmount && parseFloat(inputAmount) > 0 && (
                    <div className="mt-2 p-2.5 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Alınacak miktar:</span>
                      <span className="text-xs font-bold tabular-nums">
                        ≈ {(parseFloat(inputAmount) / getAssetPrice(selectedAsset.id, currency)).toLocaleString(undefined, { maximumSignificantDigits: 5 })} {selectedAsset.symbol}
                      </span>
                    </div>
                  )}

                  {modalAction === 'buy' && (
                    <div className="text-xs text-muted-foreground mt-1.5 text-right">
                      Kullanılabilir: <span className="font-bold text-foreground tabular-nums">{currencySymbol}{displayBalance.toLocaleString(currency === 'try' ? 'tr-TR' : 'en-US', { maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {modalAction === 'sell' && (() => {
                    const holdingItem = portfolio.find(p => p.coinId === selectedAsset.id);
                    return holdingItem ? (
                      <div className="text-xs text-muted-foreground mt-1.5 text-right">
                        Elinde: <span className="font-bold text-foreground tabular-nums">{holdingItem.amount.toLocaleString(undefined, { maximumSignificantDigits: 5 })} {selectedAsset.symbol}</span>
                      </div>
                    ) : null;
                  })()}
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 mt-1 font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer text-sm ${
                    modalAction === 'buy'
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                      : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20'
                  }`}
                >
                  {modalAction === 'buy' ? '✓ Alımı Onayla' : '✓ Satışı Onayla'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Analyzer Modal */}
      <AnimatePresence>
        {assetToAnalyze && (
          <AIAnalyzerModal
            asset={{
              id: assetToAnalyze.id,
              name: assetToAnalyze.name,
              symbol: assetToAnalyze.symbol,
              currentPrice: currency === 'try' ? assetToAnalyze.priceTry : assetToAnalyze.priceUsd,
              currencySymbol: currencySymbol,
              change24h: assetToAnalyze.change24h,
              sparkline: sparklines[assetToAnalyze.id] || []
            }}
            usdRate={usdRate}
            onClose={() => setAssetToAnalyze(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
