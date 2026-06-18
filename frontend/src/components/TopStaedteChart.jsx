import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export default function TopStaedteChart({ daten, typ }) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[400px] w-full flex flex-col">
      <h3 className="text-center text-lg font-semibold mb-5">Top 5 teuerste Standorte ({typ})</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={daten} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" stroke="#cbd5e1" tickFormatter={(tick) => `${tick / 1000}k`} />
          <YAxis dataKey="stadt" type="category" stroke="#cbd5e1" width={100} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
          <Bar 
            dataKey="durchschnittspreis" 
            name="Ø Preis (€)" 
            fill="#10b981" 
            radius={[0, 4, 4, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}