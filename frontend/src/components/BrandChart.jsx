import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Unsere Komponente empfängt "daten" und "typ" von außen (als sogenannte Props)
export default function BrandChart({ daten, typ }) {
  
  // HIER IST DIE FARB-MAGIE: Lila für Auto, Orange für Motorrad
  const barColor = typ === 'Auto' ? '#8884d8' : '#ff8042';

  return (
    <div style={{ backgroundColor: '#2a2a3c', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', height: '400px', minWidth: '300px' }}>
      <h3 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Top Marken ({typ})</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={daten} margin={{ top: 10, right: 30, left: 0, bottom: 35 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          
          {/* Winkel (-45) und kleinere Schrift verhindern Überlappung der Text-Labels */}
          <XAxis dataKey="marke" stroke="#ccc" tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }} />
          <YAxis yAxisId="left" stroke={barColor} />
          
          <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }} />
          <Legend verticalAlign="top" height={36} />
          
          <Bar yAxisId="left" dataKey="anzahl" name="Bestand" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}