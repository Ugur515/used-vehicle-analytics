import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import BrandChart from './components/BrandChart';
import PreisKilometerChart from './components/PreisKilometerChart'; // <-- NEU: Unser neuer Lego-Stein

function App() {
  const [markenDaten, setMarkenDaten] = useState([]);
  const [typDaten, setTypDaten] = useState([]);
  const [scatterDaten, setScatterDaten] = useState([]); // <-- NEU: Datenspeicher für das Punktdiagramm
  const [ausgewaehlterTyp, setAusgewaehlterTyp] = useState('Auto');

  // Initiale Daten (Kuchendiagramm)
  useEffect(() => {
    fetch('http://localhost:8000/api/fahrzeuge/pro-typ')
      .then(res => res.json())
      .then(data => setTypDaten(data.daten))
      .catch(err => console.error(err));
  }, []);

  // Daten, die sich beim Wechsel des Filters ändern
  useEffect(() => {
    // 1. Marken-Statistik abrufen
    fetch(`http://localhost:8000/api/stats/marken?typ=${ausgewaehlterTyp}`)
      .then(res => res.json())
      .then(data => setMarkenDaten(data.daten))
      .catch(err => console.error(err));

    // 2. NEU: Preis-Kilometer Daten für das Scatter-Chart abrufen
    fetch(`http://localhost:8000/api/stats/preis-kilometer?typ=${ausgewaehlterTyp}`)
      .then(res => res.json())
      .then(data => setScatterDaten(data.daten))
      .catch(err => console.error(err));
  }, [ausgewaehlterTyp]);

  return (
    // TAILWIND: Dunkler Hintergrund, weiße Schrift, padding
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 md:p-10 font-sans font-medium">
      
      {/* HEADER BEREICH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold m-0">🚀 Auto Analytics Dashboard</h1>
          <p className="text-slate-400 mt-2">Live-Analyse deiner Fahrzeugdaten</p>
        </div>
        
        {/* FILTER BEREICH */}
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

      {/* DASHBOARD GRID (Obere Reihe) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* KUCHENDIAGRAMM */}
        <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[400px] min-w-[300px]">
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
                {typDaten.map((entry, index) => {
                  const cellColor = entry.typ === 'Auto' ? '#8884d8' : '#ff8042';
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={cellColor} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setAusgewaehlterTyp(entry.typ)} 
                    />
                  );
                })}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* MARKEN DIAGRAMM (nimmt 2 von 3 Spalten ein) */}
        <div className="xl:col-span-2">
          <BrandChart daten={markenDaten} typ={ausgewaehlterTyp} />
        </div>

      </div>

      {/* PREIS-KILOMETER DIAGRAMM (Untere Reihe, volle Breite) */}
      <div className="w-full">
        <PreisKilometerChart daten={scatterDaten} typ={ausgewaehlterTyp} />
      </div>

    </div>
  );
}

export default App;