import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { headlines, symbol } = await req.json();

    if (!headlines || headlines.length === 0) {
      return NextResponse.json({ score: 0, reasoning: 'Haber bulunamadı.' });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    // Fallback: If no API key is configured, return a 400 so the frontend can fallback to keywords
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API anahtarı bulunamadı. Yerel NLP motoruna dönülüyor.' },
        { status: 400 }
      );
    }

    const prompt = `
    Sen kurumsal bir finansal analist AI'sın. Aşağıdaki haber başlıklarını ${symbol} varlığı için analiz et.
    Piyasa üzerindeki etkisini -100 (Aşırı Ayı/Negatif) ile +100 (Aşırı Boğa/Pozitif) arasında puanla.
    Sıfır (0) nötr anlamına gelir.

    Haberler:
    ${headlines.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}

    SADECE VE SADECE AŞAĞIDAKİ JSON FORMATINDA YANIT VER. EK BİR AÇIKLAMA YAZMA:
    {
      "score": <sayı>,
      "posCount": <pozitif sayılabilecek haber sayısı>,
      "negCount": <negatif sayılabilecek haber sayısı>,
      "neutralCount": <nötr haber sayısı>,
      "reasoning": "<Genel durumu özetleyen 1-2 cümlelik profesyonel bir finansal yorum>"
    }
    `;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.status}`);
    }

    const data = await res.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Gemini API returned empty text');
    }

    const parsed = JSON.parse(responseText);

    return NextResponse.json({
      score: parsed.score || 0,
      pos: parsed.posCount || 0,
      neg: parsed.negCount || 0,
      neutral: parsed.neutralCount || 0,
      reasoning: parsed.reasoning || "Haber akışı değerlendirildi."
    });

  } catch (error) {
    console.error('Sentiment API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
