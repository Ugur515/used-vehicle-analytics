import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import BrandChart from './components/BrandChart';
import PreisKilometerChart from './components/PreisKilometerChart';
import KraftstoffChart from './components/KraftstoffChart';
import WertverlustChart from './components/WertverlustChart';
import TopStaedteChart from './components/TopStaedteChart';
import GetriebeVergleich from './components/GetriebeVergleich';
import ModellDeepDive from './components/ModellDeepDive';

function App() {
  const [markenDaten, setMarkenDaten] = useState([]);
  const [typDaten, setTypDaten] = useState([]);
  const [scatterDaten, setScatterDaten] = useState([]);
  const [kraftstoffDaten, setKraftstoffDaten] = useState([]);
  const [wertverlustDaten, setWertverlustDaten] = useState([]);
  const [getriebeDaten, setGetriebeDaten] = useState([]);
  const [staedteDaten, setStaedteDaten] = useState([]);
  const [ausgewaehlterTyp, setAusgewaehlterTyp] = useState('Auto');

  // Initiale Daten (Kuchendiagramm)
  useEffect(() => {
    fetch('http://localhost:8000/api/fahrzeuge/pro-typ')
      .then(res => res.json())
      .then(data => setTypDaten(data.daten))
      .catch(err => console.error(err));
  }, []);

  // Alle vom Typ abhängigen Daten laden
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 md:p-10 font-sans font-medium">
      
      {/* HEADER BEREICH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold m-0">🚀 Auto Analytics Dashboard</h1>
          <p className="text-slate-400 mt-2">Enterprise-Marktanalyse deiner Fahrzeugdaten</p>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg flex items-center">
          <label className="mr-3 font-semibold">Fahrzeugtyp filtern:</label>
          <select 
            value={ausgewaehlterTyp} 
            onChange={(e) => setAusgewaehlterTyp(e.target.value)}
            className="p-2 rounded-lg border border-slate-600 bg-slate-900 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Auto">Autos</option>
            <option value="Motorrad">Motorräder</option>
          </select>
        </div>
      </div>

      {/* COMPACT LAYOUT ENGINE */}
      <div className="flex flex-col gap-8">
        
        {/* ROW 1: BESTAND & MARKEN */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[400px]">
            <h3 className="text-center text-lg font-semibold mb-5">Datenbank Bestand</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typDaten}
                  dataKey="anzahl"
                  nameKey="typ"
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typDaten.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.typ === 'Auto' ? '#8884d8' : '#ff8042'} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setAusgewaehlterTyp(entry.typ)} 
                    />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
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
            <div className="xl:col-span-2">
            {/* Wir extrahieren nur die Namen der Marken aus unseren Daten und geben sie weiter */}
            <ModellDeepDive verfuegbareMarken={markenDaten.map(m => m.marke)} />
          </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;