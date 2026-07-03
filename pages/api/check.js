export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ status: 'ERROR', reason: 'Vercel uzerinde GEMINI_API_KEY tanimlanmamis!' });
  }

  const SYSTEM_INSTRUCTION = `Sen Letra Roleplay sunucusunun IC Isim Onay botusun. Gorevin, gonderilen isimlerin kurallara ve yasakli listeye (Blacklist) uygunlugunu denetlemektir.
  KURALLAR:
  1. Unlu isimleri (sarkici, futbolcu, siyasetci, bilim insani, seri katil vb.) yasaktir.
  2. Mafya soyisimleri yasaktir.
  3. Oyun karakteri isimleri yasaktir.
  4. Troll veya uydurma isim/soyisimler yasaktir.
  5. Kurgusal karakter isim / soyisimleri (film, dizi, cizgi film, Manga, Anime vb.) yasaktir.
  6. Turk karakter isimleri yasaktir.
  7. Turkce'de karsiligi/kullanimi bulunan Arap-Fars-Azeri kokenli isimler kesinlikle yasaktir (Ahmet, Mehmet, Ali, Can, Hasan vb. tum isimler dahil).
  8. Mimlenmis ingilizce/türkce isimler soyisimler yasaktir.
  9. Isim Soyisimlerde marka ismi kullanimi yasaktir.
  10. Tarihi taninan insanlarin isim soyisimleri kullanimi yasaktir (Adolf Hitler, Thomas Edison vb.).
  11. Ekip isimlerinin soyisim olarak kullanimi yasaktir.
  12. Isimlerde sayi veya ozel/sekilli karakter kullanimi yasaktir (o, a, Joseph vb. sembollu harfler yasaktır).
  13. Uzun olan 2li isimler yasaktir. 4 ve uzeri sayida kelimeden olusan isim-soyisimler onay almaz.
  14. Ulke veya sehir isimleri yasaktir.
  15. 3 Harften kisa ad veya soyad kabul edilmez. Minimum 3 harf olmalidir.
  16. Isim ve soyisimlerin icinde buyuk harf kullanimi yasaktir (Ornek: Letra VIVISU, AlgoS FleX yasaktir. Sadece bas harfler buyuk olmalidir).

  BLACKLIST (KESINLIKLE YASAKLI KELIMELER):
  Alemdar, Cakir, Tekinoglu, Kocovali, Bozkurt, Escobar, Capone, Kuzgun, Black, White, Big, Daddy, Vasillias, Karayel, Korkmaz, Sarsilmaz, Baygara, Shelby, Vito, Salvator, Salvatore, Alpacino, Lee, Hunter, Ice, Ice, Conner, Wilson, Tonny, Montana, Klein, Pedro, Mitsu, Star, Flex, Chill, Traviss, Dalton, Wegh, Miller, Nicholas ve genel Silah Isimleri.
  Ciktiyi kesinlikle belirtilen JSON formatinda ver.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Kontrol edilecek isim: "${name}"` }] }],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              status: { type: "STRING", enum: ["APPROVED", "REJECTED"] },
              reason: { type: "STRING" }
            },
            required: ["status", "reason"]
          },
          temperature: 0.1
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ status: 'ERROR', reason: `Google API Hatasi: ${data.error.message}` });
    }

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ status: 'ERROR', reason: 'Yapay zeka gecerli bir yanit uretemedi veya kota doldu.' });
    }

    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', reason: `Sistem Hatasi: ${error.message}` });
  }
}
