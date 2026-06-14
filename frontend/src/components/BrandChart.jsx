import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BrandChart({ daten, typ }) {
  const barColor = typ === 'Auto' ? '#8884d8' : '#ff8042';

  return (
    // TAILWIND: bg-slate-800, abgerundete Ecken (rounded-xl), Schatten (shadow-lg)
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[400px] min-w-[300px]">
      <h3 className="text-center text-lg font-semibold mb-5">Top Marken ({typ})</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={daten} margin={{ top: 10, right: 30, left: 0, bottom: 35 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="marke" stroke="#cbd5e1" tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }} />
          <YAxis yAxisId="left" stroke={barColor} />
          
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
          <Legend verticalAlign="top" height={36} />
          
          <Bar yAxisId="left" dataKey="anzahl" name="Bestand" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}