import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Wir definieren feste Farben, damit "Elektro" z.B. immer Grün und "Benzin" immer Blau ist
const KRAFTSTOFF_FARBEN = {
  'Benzin': '#3b82f6',    // Blau
  'Diesel': '#f59e0b',    // Orange
  'Elektro': '#10b981',   // Grün
  'Hybrid': '#8b5cf6',    // Lila
  'LPG': '#ec4899',       // Pink
  'Andere': '#94a3b8'     // Grau
};

export default function KraftstoffChart({ daten, typ }) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[450px] w-full flex flex-col">
      <h3 className="text-center text-lg font-semibold mb-2">Kraftstoff-Verteilung ({typ})</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={daten}
            dataKey="anzahl"
            nameKey="kraftstoff"
            cx="50%"
            cy="45%"
            innerRadius={70} // <-- Das macht das Kuchen- zum Donut-Chart!
            outerRadius={110}
            paddingAngle={3} // Kleiner Abstand zwischen den Kuchenstücken
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {daten.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                // Nimm die vordefinierte Farbe oder 'Andere' (Grau), falls der Kraftstoff neu ist
                fill={KRAFTSTOFF_FARBEN[entry.kraftstoff] || KRAFTSTOFF_FARBEN['Andere']} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
            formatter={(value) => [`${value.toLocaleString('de-DE')} Fahrzeuge`, 'Bestand']}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}