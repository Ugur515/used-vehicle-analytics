import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

export default function WertverlustChart({ daten, typ }) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[400px] w-full flex flex-col">
      <h3 className="text-center text-lg font-semibold mb-5">Wertverfall nach Baujahr ({typ})</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={daten} margin={{ top: 10, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="baujahr" stroke="#cbd5e1">
            <Label value="Baujahr" offset={-10} position="insideBottom" fill="#94a3b8" />
          </XAxis>
          <YAxis stroke="#cbd5e1" tickFormatter={(tick) => `${tick / 1000}k`}>
            <Label value="Durchschnittspreis (€)" angle={-90} position="insideLeft" fill="#94a3b8" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
          <Legend verticalAlign="top" height={36} />
          <Line 
            type="monotone" 
            dataKey="durchschnittspreis" 
            name="Ø Preis" 
            stroke={typ === 'Auto' ? '#8884d8' : '#ff8042'} 
            strokeWidth={3}
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}