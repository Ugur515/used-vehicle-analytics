import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import BrandChart from './components/BrandChart';
import PreisKilometerChart from './components/PreisKilometerChart';
import KraftstoffChart from './components/KraftstoffChart';
import WertverlustChart from './components/WertverlustChart';
import TopStaedteChart from './components/TopStaedteChart';
import GetriebeVergleich from './components/GetriebeVergleich';
import ModellDeepDive from './components/ModellDeepDive';
import Preisrechner from './components/Preisrechner';

function App() {
  const [markenDaten, setMarkenDaten] = useState([]);
  const [typDaten, setTypDaten] = useState([]);
  const [scatterDaten, setScatterDaten] = useState([]);
  const [kraftstoffDaten, setKraftstoffDaten] = useState([]);
  const [wertverlustDaten, setWertverlustDaten] = useState([]);
  const [getriebeDaten, setGetriebeDaten] = useState([]);
  const [staedteDaten, setStaedteDaten] = useState([]);
  const [ausgewaehlterTyp, setAusgewaehlterTyp] = useState('Auto');

  useEffect(() => {
    fetch('http://localhost:8000/api/fahrzeuge/pro-typ')
      .then(res => res.json())
      .then(data => setTypDaten(data.daten))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const params = `?typ=${ausgewaehlterTyp}`;

    fetch(`http://localhost:8000/api/stats/marken${params}`)
      .then(res => res.json()).then(data => setMarkenDaten(data.daten));

    fetch(`http://localhost:8000/api/stats/preis-kilometer${params}`)
      .then(res => res.json()).then(data => setScatterDaten(data.daten));

    fetch(`http://localhost:8000/api/stats/kraftstoff${params}`)
      .then(res => res.json()).then(data => setKraftstoffDaten(data.daten));

    fetch(`http://localhost:8000/api/stats/wertverlust${params}`)
      .then(res => res.json()).then(data => setWertverlustDaten(data.daten));

    fetch(`http://localhost:8000/api/stats/getriebe-vergleich${params}`)
      .then(res => res.json()).then(data => setGetriebeDaten(data.daten));

    fetch(`http://localhost:8000/api/stats/top-staedte${params}`)
      .then(res => res.json()).then(data => setStaedteDaten(data.daten));
  }, [ausgewaehlterTyp]);

  // --- Prozente für das Bestand-Diagramm berechnen ---
  const totalTypen = typDaten.reduce((sum, item) => sum + Number(item.anzahl), 0);
  const typDatenMitProzent = typDaten.map(item => ({
    ...item,
    legendenName: `${item.typ} (${Math.round((item.anzahl / totalTypen) * 100)}%)`
  }));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">

      {/* STICKY HEADER (Bleibt beim Scrollen oben) */}
      <header className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="w-full px-6 md:px-10 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Auto Analytics</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Enterprise Market Intelligence</p>
          </div>

          {/* Moderner Segmented Control Filter (statt Dropdown) */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 shadow-inner">
            <button
              onClick={() => setAusgewaehlterTyp('Auto')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${ausgewaehlterTyp === 'Auto' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              Autos
            </button>
            <button
              onClick={() => setAusgewaehlterTyp('Motorrad')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${ausgewaehlterTyp === 'Motorrad' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              Motorräder
            </button>
          </div>
        </div>
      </header>

      {/* HAUPTINHALT (Volle Breite) */}
      <main className="w-full px-6 md:px-10 py-8 space-y-8">

        {/* KI PREISRECHNER */}
        <section>
          <Preisrechner />
        </section>

        {/* COMPACT LAYOUT ENGINE */}
        <section className="flex flex-col gap-8">

          {/* ROW 1: BESTAND & MARKEN */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-xl shadow-sm h-[400px]">
              <h3 className="text-center text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">Datenbank Bestand</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={typDatenMitProzent} // Nutzt jetzt die Daten inkl. Prozentangabe
                    dataKey="anzahl"
                    nameKey="legendenName" // Nutzt den neuen Namen
                    cx="50%"
                    cy="40%" 
                    innerRadius={60}
                    outerRadius={90} 
                    stroke="none"
                  >
                    {typDatenMitProzent.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.typ === 'Auto' ? '#4f46e5' : '#ff8042'}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setAusgewaehlterTyp(entry.typ)}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                  {/* Legende mit 80px Höhe für mehr Luft nach unten */}
                  <Legend verticalAlign="bottom" height={80} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="xl:col-span-2">
              <BrandChart daten={markenDaten} typ={ausgewaehlterTyp} />
            </div>
          </div>

          {/* ROW 2: KRAFTSTOFF & SCATTER PLOT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
              <KraftstoffChart daten={kraftstoffDaten} typ={ausgewaehlterTyp} />
            </div>
            <div className="xl:col-span-2">
              <PreisKilometerChart daten={scatterDaten} typ={ausgewaehlterTyp} />
            </div>
          </div>

          {/* ROW 3: WERTVERLUST & GETRIEBE */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <WertverlustChart daten={wertverlustDaten} typ={ausgewaehlterTyp} />
            </div>
            <div className="xl:col-span-1">
              <GetriebeVergleich daten={getriebeDaten} typ={ausgewaehlterTyp} />
            </div>
          </div>

          {/* ROW 4: REGIONALER VERGLEICH & MODELL DEEP DIVE */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
              <TopStaedteChart daten={staedteDaten} typ={ausgewaehlterTyp} />
            </div>
            <div className="xl:col-span-2">
              <ModellDeepDive verfuegbareMarken={markenDaten.map(m => m.marke)} />
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default App;