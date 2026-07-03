import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkName = async () => {
    if (!name.trim()) return alert("Lütfen bir isim yazın!");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ status: 'ERROR', reason: 'Sorgulama sırasında bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-slate-200 min-h-screen flex items-center justify-center p-4" style={{background: 'radial-gradient(circle at center, #06152d 0%, #010610 100%)'}}>
      <head>
        <title>Letra Roleplay - IC İsim Kontrolü</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`
          .neon-text {
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4);
          }
          .neon-box {
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.15), inset 0 0 15px rgba(6, 182, 212, 0.05);
          }
          .neon-btn {
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.6);
          }
          .neon-btn:hover {
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.9);
          }
        `}</style>
      </head>
      
      <div className="w-full max-w-lg bg-slate-950/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 md:p-8 space-y-6 neon-box">
        
        {/* Logo ve Başlık Alanı */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <img 
            src="https://media.discordapp.net/attachments/1485141824535396372/1495758016237277294/LetraVXLogoTemp.png?ex=6a48f7b4&is=6a47a634&hm=bd2c91e6129db9a59dd865d4a0b2190d9833a5f37a65885951e0c1800e3ca281&=&format=webp&quality=lossless&width=720&height=720" 
            alt="Letra RP Logo" 
            className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] mb-1" 
          />
          <h1 className="text-3xl font-black tracking-wider text-cyan-400 neon-text">LETRA ROLEPLAY</h1>
          <p className="text-xs uppercase font-bold tracking-widest text-cyan-400/70">IC İsim Kontrol Sistemi</p>
        </div>
        
        <hr className="border-cyan-950/50" />
        
        {/* Giriş ve Buton Alanı */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cyan-500/60 mb-2">Karakter Adı ve Soyadı</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-slate-950/90 border border-cyan-950 text-cyan-100 placeholder-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-3.5 transition-all outline-none text-center font-semibold tracking-wide" 
              placeholder="Örn: Joseph Darry" 
            />
          </div>
          
          <button 
            onClick={checkName} 
            disabled={loading} 
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black py-4 px-6 rounded-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center space-x-2 neon-btn text-base tracking-wider"
          >
            {loading ? <i className="fa-solid fa-spinner animate-spin text-lg"></i> : <i className="fa-solid fa-circle-check text-lg"></i>}
            <span>{loading ? 'SORGULANIYOR...' : 'KONTROL ET'}</span>
          </button>
        </div>

        {/* Sonuç Alanı */}
        {result && (
          <div className={`rounded-xl p-4 border transition-all duration-300 ${result.status === 'APPROVED' ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400' : result.status === 'REJECTED' ? 'border-rose-500/30 bg-rose-950/20 text-rose-400' : 'border-amber-500/30 bg-amber-950/20 text-amber-400'}`}>
            <div className="flex items-start space-x-3">
              <div className="text-xl mt-0.5">
                {result.status === 'APPROVED' ? <i className="fa-solid fa-circle-check text-emerald-500"></i> : <i className="fa-solid fa-circle-xmark text-rose-500"></i>}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base">{result.status === 'APPROVED' ? 'Karakter Adı Uygun' : 'Karakter Adı Uygunsuz'}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{result.reason}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Alt Bilgi */}
        <div className="bg-slate-950/80 rounded-xl p-3 border border-cyan-950/30 text-center">
          <span className="text-xs text-slate-500 flex items-center justify-center gap-1.5"><i className="fa-solid fa-microchip text-cyan-500/50"></i>Gemini yapay zekâ altyapısı ile anlık denetlenir.</span>
        </div>
      </div>
    </div>
  );
}
