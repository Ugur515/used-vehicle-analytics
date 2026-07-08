import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Moderne Farben für die verschiedenen Kraftstoffe
const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6']; 

export default function KraftstoffChart({ daten, typ }) {
  if (!daten || daten.length === 0) return null;

  // 1. Die Gesamtzahl aller Fahrzeuge berechnen (für die 100%)
  const total = daten.reduce((sum, item) => sum + Number(item.anzahl), 0);

  // 2. Den Text für die Legende neu zusammenbauen: "Name (XX%)"
  const datenMitProzent = daten.map(item => ({
    ...item,
    legendenName: `${item.kraftstoff} (${Math.round((item.anzahl / total) * 100)}%)`
  }));

  return (
    <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-xl shadow-sm h-[400px]">
      <h3 className="text-center text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">
        Kraftstoff-Verteilung ({typ})
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={datenMitProzent} // Wir nutzen unsere neuen Daten
            dataKey="anzahl"
            nameKey="legendenName" // Wir sagen dem Diagramm, dass es den neuen Text nutzen soll
            cx="50%"
            cy="40%"
            innerRadius={60}
            outerRadius={90}
            stroke="none"
          >
            {datenMitProzent.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
          {/* Legende mit 80px Höhe für mehr Platz für mehrere Zeilen */}
          <Legend verticalAlign="bottom" height={80} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}