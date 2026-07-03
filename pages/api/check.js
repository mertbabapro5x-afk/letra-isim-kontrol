export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ status: 'ERROR', reason: 'Vercel üzerinde GEMINI_API_KEY tanımlanmamış!' });
  }

  const SYSTEM_INSTRUCTION = `Sen Letra Roleplay sunucusunun IC İsim Onay botusun. Görevin, gönderilen isimlerin kurallara ve yasaklı listeye (Blacklist) uygunluğunu denetlemektir.
  KURALLAR:
  1. Ünlü isimleri (şarkıcı, futbolcu, siyasetçi, bilim insanı, seri katil vb.) yasaktır.
  2. Mafya soyisimleri yasaktır.
  3. Oyun karakteri isimleri yasaktır.
  4. Troll veya uydurma isim/soyisimler yasaktır.
  5. Kurgusal karakter isim / soyisimleri (film, dizi, çizgi film, Manga, Anime vb.) yasaktır.
  6. Türk karakter isimleri yasaktır.
  7. Türkçe'de karşılığı/kullanımı bulunan Arap-Fars-Azeri kökenli isimler kesinlikle yasaktır (Ahmet, Mehmet, Ali, Can, Hasan vb. tüm isimler dahil).
  8. Mimlenmiş ingilizce/türkçe isimler soyisimler yasaktır.
  9. İsim Soyisimlerde marka ismi kullanımı yasaktır.
  10. Tarihi tanınan insanların isim soyisimleri kullanımı yasaktır (Adolf Hitler, Thomas Edison vb.).
  11. Ekip isimlerinin soyisim olarak kullanımı yasaktır.
  12. İsimlerde sayı veya özel/şekilli karakter kullanımı yasaktır (ó, á, Jóseph vb. sembollü harfler yasaktır).
  13. Uzun olan 2li isimler yasaktır. 4 ve üzeri sayıda kelimeden oluşan isim-soyisimler onay almaz.
  14. Ülke veya şehir isimleri yasaktır.
  15. 3 Harften kısa ad veya soyad kabul edilmez. Minimum 3 harf olmalıdır.
  16. İsim ve soyisimlerin içinde büyük harf kullanımı yasaktır (Örnek: Letra VİVİSU, AlgoS FleX yasaktır. Sadece baş harfler büyük olmalıdır).

  BLACKLIST (KESİNLİKLE YASAKLI KELİMELER):
  Alemdar, Çakır, Tekinoğlu, Koçovalı, Bozkurt, Escobar, Capone, Kuzgun, Black, White, Big, Daddy, Vasillias, Karayel, Korkmaz, Sarsılmaz, Baygara, Shelby, Vito, Salvator, Salvatore, Alpaçino, Lee, Hunter, Ice, İce, Conner, Wilson, Tonny, Montana, Klein, Pedro, Mitsu, Star, Flex, Chill, Traviss, Dalton, Wegh, Miller, Nicholas ve genel "Silah İsimleri".
  Çıktıyı kesinlikle belirtilen JSON formatında ver.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    
    // Google'dan gelen ham hatayı anlamak için güvenlik kontrolü
    if (data.error) {
      return res.status(500).json({ status: 'ERROR', reason: `Google API Hatası: ${data.error.message}` });
    }

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ status: 'ERROR', reason: 'Yapay zeka geçerli bir yanıt üretemedi.' });
    }

    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Detaylı Hata Logu:", error);
    return res.status(500).json({ status: 'ERROR', reason: `Sistem Hatası: ${error.message}` });
  }
}
