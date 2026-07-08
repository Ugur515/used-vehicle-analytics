import { useState } from 'react';

// Unsere festen Markenlisten aus dem Datengenerator
const AUTO_MARKEN = ["Volkswagen", "BMW", "Audi", "Mercedes-Benz", "Skoda", "Ford", "Toyota", "Porsche", "Tesla", "Renault", "Seat"];
const MOTORRAD_MARKEN = ["Yamaha", "Honda", "Kawasaki", "BMW Motorrad", "Ducati", "KTM", "Harley-Davidson"];

// Getrennte Kraftstoff-Listen für die dynamische Auswahl
const KRAFTSTOFF_AUTO = ["Benzin", "Diesel", "Elektro", "Hybrid"];
const KRAFTSTOFF_MOTORRAD = ["Benzin", "Elektro"];

export default function Preisrechner() {
  const [formData, setFormData] = useState({
    fahrzeugtyp: 'Auto',
    marke: 'Volkswagen', // Startwert für Auto
    baujahr: 2018,
    kilometerstand: 80000,
    kraftstoff: 'Benzin',
    getriebe: 'Automatik'
  });
  
  const [geschaetzterPreis, setGeschaetzterPreis] = useState(null);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState(null);

  // Welche Marken sollen aktuell im Dropdown gezeigt werden?
  const aktuelleMarken = formData.fahrzeugtyp === 'Auto' ? AUTO_MARKEN : MOTORRAD_MARKEN;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Wenn der Fahrzeugtyp gewechselt wird, müssen Marke, Kraftstoff und Getriebe angepasst werden!
      if (name === 'fahrzeugtyp') {
        newData.marke = value === 'Auto' ? AUTO_MARKEN[0] : MOTORRAD_MARKEN[0];
        newData.kraftstoff = 'Benzin'; // Sicherer Standardwert für beide Typen
        newData.getriebe = value === 'Motorrad' ? 'Manuell' : 'Automatik';
      }
      
      return newData;
    });
  };

  const preisBerechnen = async (e) => {
    e.preventDefault();
    setLaedt(true);
    setFehler(null);
    setGeschaetzterPreis(null);
    
    try {
      const res = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          baujahr: parseInt(formData.baujahr),
          kilometerstand: parseInt(formData.kilometerstand)
        })
      });
      
      const data = await res.json();
      if (data.erfolg) {
        setGeschaetzterPreis(data.geschaetzter_preis);
      } else {
        setFehler(data.fehler || "Unbekannter Fehler von der API");
      }
    } catch (err) {
      setFehler("Netzwerkfehler: Backend nicht erreichbar");
    }
    
    setLaedt(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full border border-indigo-500/30">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🤖</span>
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
          KI Preis-Schätzer
        </h3>
      </div>

      <form onSubmit={preisBerechnen} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Typ & Marke */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider">Fahrzeugtyp</label>
          <select name="fahrzeugtyp" value={formData.fahrzeugtyp} onChange={handleInputChange} className="p-2 rounded bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white">
            <option value="Auto">Auto</option>
            <option value="Motorrad">Motorrad</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider">Marke</label>
          <select name="marke" value={formData.marke} onChange={handleInputChange} className="p-2 rounded bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white">
            {aktuelleMarken.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Kraftstoff & Getriebe */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider">Kraftstoff</label>
          <select name="kraftstoff" value={formData.kraftstoff} onChange={handleInputChange} className="p-2 rounded bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white">
            {(formData.fahrzeugtyp === 'Auto' ? KRAFTSTOFF_AUTO : KRAFTSTOFF_MOTORRAD).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider">Getriebe</label>
          <select name="getriebe" value={formData.getriebe} onChange={handleInputChange} className="p-2 rounded bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white">
            <option value="Automatik">Automatik</option>
            <option value="Manuell">Manuell</option>
          </select>
        </div>

        {/* Baujahr & Kilometer */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider">Baujahr</label>
          <input type="number" name="baujahr" value={formData.baujahr} onChange={handleInputChange} min="1990" max="2026" className="p-2 rounded bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider">Kilometerstand</label>
          <input type="number" name="kilometerstand" value={formData.kilometerstand} onChange={handleInputChange} step="1000" className="p-2 rounded bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-white" />
        </div>

        {/* Submit Button & Ergebnis/Fehler */}
        <div className="md:col-span-2 lg:col-span-3 flex items-center justify-between mt-2 pt-4 border-t border-slate-700">
          <button 
            type="submit" 
            disabled={laedt}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {laedt ? 'Berechne...' : 'Preis berechnen'}
          </button>

          {fehler && (
            <span className="text-red-400 text-sm">{fehler}</span>
          )}

          {geschaetzterPreis !== null && !laedt && !fehler && (
            <div className="text-right">
              <span className="block text-xs text-slate-400 uppercase tracking-wider">Geschätzter Marktwert</span>
              <span className="text-3xl font-bold text-emerald-400">
                {geschaetzterPreis.toLocaleString('de-DE')} €
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}