import { useState, useEffect } from 'react';

// Die Komponente empfängt die verfügbaren Marken als "Prop"
export default function ModellDeepDive({ verfuegbareMarken }) {
  const [marke, setMarke] = useState('');
  const [daten, setDaten] = useState([]);

  // LOGIK: Sobald die Marken geladen sind, setze automatisch die erste als Standard
  useEffect(() => {
    if (verfuegbareMarken && verfuegbareMarken.length > 0) {
      // Wenn noch keine Marke gewählt ist, oder man z.B. von Auto auf Motorrad wechselt:
      if (!marke || !verfuegbareMarken.includes(marke)) {
        setMarke(verfuegbareMarken[0]);
      }
    }
  }, [verfuegbareMarken, marke]);

  // LOGIK: Daten vom Backend holen, sobald sich die Marke ändert
  useEffect(() => {
    if (!marke) return;
    fetch(`http://localhost:8000/api/stats/modelle?marke=${marke}`)
      .then(res => res.json())
      .then(data => setDaten(data.daten))
      .catch(err => console.error(err));
  }, [marke]);

  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[400px] w-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold">🔍 Modell Deep-Dive</h3>
        
        {/* Das interaktive Dropdown-Menü statt dem Input-Feld */}
        <select 
          value={marke} 
          onChange={(e) => setMarke(e.target.value)} 
          className="p-1.5 text-sm rounded-lg border border-slate-600 bg-slate-900 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
        >
          {verfuegbareMarken?.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="overflow-auto flex-grow rounded-lg border border-slate-700 bg-slate-900/40">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase text-xs sticky top-0">
            <tr>
              <th className="p-3">Modell</th>
              <th className="p-3 text-right">Anzahl</th>
              <th className="p-3 text-right">Ø Preis</th>
              <th className="p-3 text-right">Ø KM</th>
            </tr>
          </thead>
          <tbody>
            {daten.map((row, index) => (
              <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="p-3 font-semibold text-slate-100">{row.modell}</td>
                <td className="p-3 text-right">{row.anzahl.toLocaleString('de-DE')}</td>
                <td className="p-3 text-right text-emerald-400 font-medium">{row.durchschnittspreis.toLocaleString('de-DE')} €</td>
                <td className="p-3 text-right text-slate-400">{row.durchschnitts_km.toLocaleString('de-DE')} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}