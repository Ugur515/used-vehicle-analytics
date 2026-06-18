export default function GetriebeVergleich({ daten, typ }) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-[400px] w-full flex flex-col justify-between">
      <h3 className="text-center text-lg font-semibold mb-2">Getriebe-Direktvergleich ({typ})</h3>
      
      <div className="grid grid-cols-1 gap-4 flex-grow justify-center my-auto">
        {daten.map((item) => (
          <div key={item.getriebe} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                {item.getriebe === 'Automatik' ? '🕹️ Automatik' : '⚙️ Manuell'}
              </span>
              <span className="text-xs text-slate-500">Angebote: {item.anzahl.toLocaleString('de-DE')}</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold block text-indigo-400">
                {item.durchschnittspreis.toLocaleString('de-DE')} €
              </span>
              <span className="text-xs text-slate-400">Ø {item.durchschnitts_km.toLocaleString('de-DE')} km</span>
            </div>
          </div>
        ))}
        {daten.length === 0 && <p className="text-center text-slate-500">Keine Getriebedaten vorhanden</p>}
      </div>
    </div>
  );
}