from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, text

app = FastAPI(
    title="Used Vehicle Analytics & Prediction API",
    description="Ein mächtiges Backend für Marktanalysen und ML-Preisschätzungen von Gebrauchtfahrzeugen.",
    version="1.0.0"
)

# --- CORS KONFIGURATION ---
# Erlaubt dem React-Frontend (Port 5173), Daten anzufragen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],  # Erlaubt GET, POST, etc.
    allow_headers=["*"],
)

# Verbindung zur Docker-PostgreSQL-Datenbank
DB_URL = 'postgresql://postgres:meingeheimespasswort@localhost:5432/postgres'
engine = create_engine(DB_URL)

# --- PYDANTIC MODELLE ---
# Definiert die Struktur für die ML-Preisschätzung (POST)
class FahrzeugAnfrage(BaseModel):
    fahrzeugtyp: str  # 'Auto' oder 'Motorrad'
    marke: str
    baujahr: int
    kilometerstand: int

# --- BASIS ENDPUNKT ---
@app.get("/")
def read_root():
    return {
        "status": "Online",
        "message": "Willkommen bei der Fahrzeug-Analytics API! Gehe zu /docs für die interaktive Dokumentation."
    }

# --- ANALYTICS: BASIS-STATISTIKEN ---

@app.get("/api/fahrzeuge/pro-typ")
def get_vehicle_count_by_type():
    """Gibt die Gesamtzahl der Fahrzeuge aufgeteilt nach Auto und Motorrad zurück."""
    query = text("SELECT fahrzeugtyp, COUNT(*) as anzahl FROM fahrzeuge GROUP BY fahrzeugtyp")
    with engine.connect() as connection:
        result = connection.execute(query)
        data = [{"typ": row[0], "anzahl": row[1]} for row in result]
    return {"daten": data}

@app.get("/api/stats/marken")
def get_brand_stats(typ: str = Query("Auto", description="'Auto' oder 'Motorrad'")):
    """Berechnet die Marktanteile (Anzahl) und den Durchschnittspreis pro Marke."""
    query = text("""
        SELECT marke, COUNT(*) as anzahl, ROUND(AVG(preis_euro), 0) as avg_preis
        FROM fahrzeuge 
        WHERE fahrzeugtyp = :typ
        GROUP BY marke 
        ORDER BY anzahl DESC;
    """)
    with engine.connect() as connection:
        result = connection.execute(query, {"typ": typ})
        data = [{"marke": row[0], "anzahl": row[1], "durchschnittspreis": row[2]} for row in result]
    return {"beschreibung": f"Marktübersicht Marken ({typ})", "daten": data}

@app.get("/api/stats/kraftstoff")
def get_fuel_stats(typ: str = Query("Auto", description="'Auto' oder 'Motorrad'")):
    """Zeigt die Verteilung der verschiedenen Kraftstoffarten."""
    query = text("""
        SELECT kraftstoff, COUNT(*) as anzahl 
        FROM fahrzeuge 
        WHERE fahrzeugtyp = :typ
        GROUP BY kraftstoff 
        ORDER BY anzahl DESC;
    """)
    with engine.connect() as connection:
        result = connection.execute(query, {"typ": typ})
        data = [{"kraftstoff": row[0], "anzahl": row[1]} for row in result]
    return {"beschreibung": f"Kraftstoffverteilung ({typ})", "daten": data}

# --- ADVANCED ANALYTICS: VERGLEICHE & DEEP DIVES ---

@app.get("/api/stats/wertverlust")
def get_depreciation_stats(typ: str = Query("Auto", description="'Auto' oder 'Motorrad'")):
    """Wertverlust-Kurve: Berechnet den Durchschnittspreis nach Baujahr."""
    query = text("""
        SELECT baujahr, ROUND(AVG(preis_euro), 0) as avg_preis 
        FROM fahrzeuge 
        WHERE fahrzeugtyp = :typ 
        GROUP BY baujahr 
        ORDER BY baujahr DESC;
    """)
    with engine.connect() as connection:
        result = connection.execute(query, {"typ": typ})
        data = [{"baujahr": row[0], "durchschnittspreis": row[1]} for row in result]
    return {"beschreibung": f"Wertverlust nach Baujahr ({typ})", "daten": data}

@app.get("/api/stats/getriebe-vergleich")
def get_gearbox_comparison(typ: str = Query("Auto", description="'Auto' oder 'Motorrad'")):
    """A/B-Vergleich: Automatik vs. Manuell (Preis & Kilometerstand)."""
    query = text("""
        SELECT getriebe, COUNT(*) as anzahl, ROUND(AVG(preis_euro), 0) as avg_preis, ROUND(AVG(kilometerstand), 0) as avg_km
        FROM fahrzeuge
        WHERE fahrzeugtyp = :typ
        GROUP BY getriebe;
    """)
    with engine.connect() as connection:
        result = connection.execute(query, {"typ": typ})
        data = [{
            "getriebe": row[0], 
            "anzahl": row[1], 
            "durchschnittspreis": row[2],
            "durchschnitts_km": row[3]
        } for row in result]
    return {"beschreibung": f"Getriebe-Direktvergleich ({typ})", "daten": data}

@app.get("/api/stats/top-staedte")
def get_top_cities(typ: str = Query("Auto", description="'Auto' oder 'Motorrad'")):
    """Regionale Analyse: Die 5 Städte mit den höchsten Durchschnittspreisen."""
    query = text("""
        SELECT standort, COUNT(*) as angebote, ROUND(AVG(preis_euro), 0) as avg_preis
        FROM fahrzeuge
        WHERE fahrzeugtyp = :typ
        GROUP BY standort
        ORDER BY avg_preis DESC
        LIMIT 5;
    """)
    with engine.connect() as connection:
        result = connection.execute(query, {"typ": typ})
        data = [{"stadt": row[0], "anzahl_angebote": row[1], "durchschnittspreis": row[2]} for row in result]
    return {"beschreibung": f"Top 5 teuerste Standorte für {typ} (mit >500 Angeboten)", "daten": data}

@app.get("/api/stats/modelle")
def get_model_deep_dive(marke: str = Query("VW", description="Z.B. VW, BMW, Audi, Porsche...")):
    """Deep Dive: Die meistverkauften Modelle einer bestimmten Marke inklusive Kennzahlen."""
    query = text("""
        SELECT modell, COUNT(*) as anzahl, ROUND(AVG(preis_euro), 0) as avg_preis, ROUND(AVG(kilometerstand), 0) as avg_km
        FROM fahrzeuge
        WHERE marke = :marke
        GROUP BY modell
        ORDER BY anzahl DESC
        LIMIT 10;
    """)
    with engine.connect() as connection:
        result = connection.execute(query, {"marke": marke})
        data = [{
            "modell": row[0], 
            "anzahl": row[1], 
            "durchschnittspreis": row[2], 
            "durchschnitts_km": row[3]
        } for row in result]
    return {"beschreibung": f"Modell-Deep-Dive für Marke: {marke}", "daten": data}

@app.get("/api/stats/preis-kilometer")
def get_preis_kilometer(typ: str = Query("Auto", description="'Auto' oder 'Motorrad'")):
    """Daten für den Scatter-Plot: Preis im Verhältnis zum Kilometerstand (Limitiert auf 500 für Performance)."""
    query = text("""
        SELECT kilometerstand, preis_euro, marke 
        FROM fahrzeuge 
        WHERE fahrzeugtyp = :typ 
        ORDER BY RANDOM() 
        LIMIT 500;
    """)
    with engine.connect() as connection:
        result = connection.execute(query, {"typ": typ})
        # Wir nutzen row[0], row[1], row[2], exakt wie in deinen anderen Endpunkten!
        data = [{"kilometerstand": row[0], "preis": row[1], "marke": row[2]} for row in result]
    return {"beschreibung": f"Preis-Kilometer Scatter ({typ})", "daten": data}

# --- MACHINE LEARNING PLATZHALTER (POST) ---

@app.post("/api/predict")
def predict_price(anfrage: FahrzeugAnfrage):
    """Nimmt Fahrzeugdaten entgegen und berechnet eine KI-Preisschätzung (Aktuell: Mathematischer Dummy)."""
    if anfrage.fahrzeugtyp == "Motorrad":
        basis_wert = 15000
        abzug_km = (anfrage.kilometerstand / 1000) * 80
    else:
        basis_wert = 30000
        abzug_km = (anfrage.kilometerstand / 1000) * 50

    abzug_alter = (2026 - anfrage.baujahr) * 1000
    geschaetzter_preis = max(500, basis_wert - abzug_alter - abzug_km)
    
    return {
        "status": "Erfolgreich",
        "vorhergesagter_preis_euro": round(geschaetzter_preis, 2)
    }