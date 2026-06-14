import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import BrandChart from './components/BrandChart'; // <-- WIR IMPORTIEREN DEINEN LEGO-STEIN

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

function App() {
  const [markenDaten, setMarkenDaten] = useState([]);
  const [typDaten, setTypDaten] = useState([]);
  const [ausgewaehlterTyp, setAusgewaehlterTyp] = useState('Auto');

  useEffect(() => {
    fetch('http://localhost:8000/api/fahrzeuge/pro-typ')
      .then(res => res.json())
      .then(data => setTypDaten(data.daten))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/api/stats/marken?typ=${ausgewaehlterTyp}`)
      .then(res => res.json())
      .then(data => setMarkenDaten(data.daten))
      .catch(err => console.error(err));
  }, [ausgewaehlterTyp]);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#1e1e2f', minHeight: '100vh', color: 'white' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0 }}>🚀 Auto Analytics Dashboard</h1>
          <p style={{ color: '#aaa', marginTop: '10px' }}>Live-Analyse deiner Fahrzeugdaten</p>
        </div>

        <div style={{ backgroundColor: '#2a2a3c', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Fahrzeugtyp filtern:</label>
          <select
            value={ausgewaehlterTyp}
            onChange={(e) => setAusgewaehlterTyp(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#1e1e2f', color: 'white', fontSize: '16px', cursor: 'pointer' }}
          >
            <option value="Auto">Autos</option>
            <option value="Motorrad">Motorräder</option>
          </select>
        </div>
      </div>

      {/* DASHBOARD GRID - Jetzt mit responsivem auto-fit! */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>

        {/* KARTE 1: Das Kuchendiagramm */}
        <div style={{ backgroundColor: '#2a2a3c', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', height: '400px', minWidth: '300px' }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Datenbank Bestand</h3>
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
                      // HIER IST DIE NEUE MAGIE: 
                      // 1. Mauszeiger wird zur Hand
                      style={{ cursor: 'pointer' }}
                      // 2. Klick ändert den globalen Filter-Zustand!
                      onClick={() => setAusgewaehlterTyp(entry.typ)}
                    />
                  );
                })}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* KARTE 2: UNSER NEUER LEGO-STEIN */}
        <BrandChart daten={markenDaten} typ={ausgewaehlterTyp} />

      </div>
    </div>
  );
}

export default App;