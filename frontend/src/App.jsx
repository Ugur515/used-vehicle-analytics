import { useState, useEffect } from 'react'

function App() {
  // Hier speichern wir die Daten ab, sobald das Backend sie liefert
  const [fahrzeugDaten, setFahrzeugDaten] = useState(null)

  // useEffect feuert den fetch-Befehl genau einmal ab, wenn die Seite lädt
  useEffect(() => {
    fetch('http://localhost:8000/api/fahrzeuge/pro-typ')
      .then(response => response.json())         // Paket auspacken
      .then(data => setFahrzeugDaten(data.daten)) // Die echten Daten im State speichern
      .catch(error => console.error("Fehler beim Laden:", error))
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>🚗 Auto Analytics Dashboard</h1>
      <p>Willkommen in deinem Gastraum. Hier sind die Daten aus der Küche:</p>

      {/* Wenn fahrzeugDaten noch leer ist, zeige "Lade...", sonst zeige die Liste */}
      {fahrzeugDaten ? (
        <ul>
          {fahrzeugDaten.map((item, index) => (
            <li key={index} style={{ fontSize: '20px', margin: '10px 0' }}>
              <strong>{item.typ}:</strong> {item.anzahl} Fahrzeuge in der DB
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'orange' }}>Lade Daten vom Backend...</p>
      )}
    </div>
  )
}

export default App