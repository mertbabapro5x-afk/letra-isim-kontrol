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
    <div className="text-slate-200 min-h-screen flex items-center justify-center p-4" style={{background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)'}}>
      <head>
        <title>Letra Roleplay - IC İsim Kontrolü</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-md border border-pink-500/30 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-400">LETRA ROLEPLAY</h1>
          <p className="text-sm uppercase font-semibold tracking-widest text-pink-400/80">IC İsim Kontrol Sistemi</p>
        </div>
        <hr className="border-slate-800" />
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Karakter Adı ve Soyadı</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 transition-all outline-none text-center font-medium" placeholder="Örn: Joseph Darry" />
          </div>
          <button onClick={checkName} disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-pink-600/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2">
            {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
            <span>{loading ? 'Sorgulanıyor...' : 'KONTROL ET'}</span>
          </button>
        </div>

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
        <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800 text-center">
          <span className="text-xs text-slate-500 flex items-center justify-center gap-1"><i className="fa-solid fa-circle-info text-pink-500/70"></i>Kurallara göre anlık denetlenir.</span>
        </div>
      </div>
    </div>
  );
}
