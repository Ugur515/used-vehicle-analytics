import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts';

// LOGIK: Erzeugt aus einem beliebigen Wort immer dieselbe, einzigartige HSL-Farbe
const generiereFarbeAusText = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generiert einen Wert zwischen 0 und 360 (für den Farbkreis)
  const farbton = Math.abs(hash) % 360; 
  // 70% Sättigung, 60% Helligkeit sorgen dafür, dass die Farben im Darkmode gut aussehen
  return `hsl(${farbton}, 70%, 60%)`; 
};

export default function PreisKilometerChart({ daten, typ }) {
  const [ausgewaehlteMarke, setAusgewaehlteMarke] = useState('Alle');

  const verfuegbareMarken = ['Alle', ...new Set(daten.map(item => item.marke))];

  // LOGIK: Welche Marken sollen aktuell gezeichnet werden?
  const markenZumZeichnen = ausgewaehlteMarke === 'Alle' 
    ? verfuegbareMarken.filter(m => m !== 'Alle') 
    : [ausgewaehlteMarke];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-700 text-slate-200">
          <p className="font-bold mb-1" style={{ color: payload[0].payload.fill }}>
            {payload[0].payload.marke}
          </p>
          <p>Kilometer: {payload[0].value.toLocaleString('de-DE')} km</p>
          <p>Preis: {payload[1].value.toLocaleString('de-DE')} €</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[450px] w-full flex flex-col">
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold m-0">Preisverfall nach Kilometern ({typ})</h3>
        
        <select 
          value={ausgewaehlteMarke} 
          onChange={(e) => setAusgewaehlteMarke(e.target.value)}
          className="p-1.5 text-sm rounded-lg border border-slate-600 bg-slate-900 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {verfuegbareMarken.map(marke => (
            <option key={marke} value={marke}>{marke}</option>
          ))}
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 30, bottom: 25, left: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          
          <XAxis 
            type="number" 
            dataKey="kilometerstand" 
            stroke="#cbd5e1" 
            tickFormatter={(tick) => `${tick / 1000}k`} 
          >
            <Label value="Kilometerstand (km)" offset={-15} position="insideBottom" fill="#94a3b8" />
          </XAxis>
          
          <YAxis 
            type="number" 
            dataKey="preis" 
            stroke="#cbd5e1" 
            tickFormatter={(tick) => `${tick / 1000}k`}
          >
            <Label value="Preis (€)" angle={-90} position="insideLeft" fill="#94a3b8" style={{ textAnchor: 'middle' }} />
          </YAxis>
          
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          {/* HIER IST DIE NEUE LEGENDE */}
          <Legend verticalAlign="top" height={36} iconType="circle" />
          
          {/* HIER SCHLEIFEN WIR DURCH DIE MARKEN, STATT DURCH DIE PUNKTE */}
          {markenZumZeichnen.map((marke) => {
            const markenDaten = daten.filter(d => d.marke === marke);
            const dynamischeFarbe = generiereFarbeAusText(marke);

            return (
              <Scatter 
                key={marke} 
                name={marke} 
                data={markenDaten} 
                fill={dynamischeFarbe} 
                opacity={0.8} 
              />
            );
          })}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}