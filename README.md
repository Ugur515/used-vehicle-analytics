# Used Vehicle Analytics & Prediction Platform

Ein iterativ aufgebautes End-to-End Data Engineering und Full-Stack Projekt. 
Ziel dieses Projekts ist es, eine Plattform für Gebrauchtfahrzeuge zu erschaffen, die zwei Kernfunktionen vereint:
1. **Business Intelligence (BI) Dashboard:** Datengetriebene Analysen, Durchschnitte und Marktverteilungen.
2. **Machine Learning Price Predictor:** Ein ML-Modell, das aus den historischen Daten lernt, um faire Fahrzeugpreise vorherzusagen.

## Tech Stack & Tools
**Aktuell im Einsatz (Data Engineering & Infra):**
* **Data Processing:** Python (Pandas, Faker)
* **Database & Bridge:** PostgreSQL, SQLAlchemy, Psycopg2
* **Infrastruktur & Containerisierung:** Docker, GitHub
* **Environment Management:** uv (Virtual Environments)

**Geplant für kommende Meilensteine:**
* **Backend API:** FastAPI (Python)
* **Machine Learning:** Scikit-Learn (Random Forest / Linear Regression)
* **Frontend:** React / TypeScript / TailwindCSS & Chart.js (für die Graphen)

## Projekt-Fortschritt (Roadmap)

### Phase 1: Data Engineering & Database 
- [x] Python-Skript zur Generierung von 200.000 realistischen Gebrauchtwagen & Motorrädern gebaut (`Faker`).
- [x] Logische Datenstrukturen und Abhängigkeiten (Wertverlust vs. Alter/KM) im Datengenerator verankert.
- [x] PostgreSQL Datenbank als Docker-Container aufgesetzt.
- [x] Python ETL-Pipeline implementiert, die Rohdaten bereinigt, transformiert (lowercase Schema) und in die DB lädt.
- [x] Datenintegrität via SQL in VS Code überprüft.

### Phase 2: Backend & API-Entwicklung 
- [x] FastAPI Projekt initialisieren und strukturieren.
- [x] Datenbank-Anbindung (SQLAlchemy Engine) im Backend integrieren.
- [x] **Analytics-Endpunkte** bauen (z.B. `/api/stats/brands` für Marktanteile, `/api/stats/prices` für Durchschnitte).
- [x] **Prediction-Endpunkt** vorbereiten (`/api/predict`), der Fahrzeugdaten entgegennimmt.

### Phase 3: Data Science & Machine Learning 
- [ ] Daten aus PostgreSQL in ein Jupyter Notebook laden.
- [ ] Feature Engineering & Modell-Training (z. B. mit `Scikit-Learn`).
- [ ] Validierung des Modells (Wie gut hat die KI die im Generator versteckten Muster gelernt?).
- [ ] Abspeichern des Modells (`joblib`/`pickle`) und Einbindung in die FastAPI.

### Phase 4: Frontend & UI 
- [x] Modernes React-Projekt mit TailwindCSS aufsetzen.
- [x] **Dashboard-Ansicht:** Interaktive Charts (Chart.js/Recharts) zur Marktanalyse basierend auf den API-Daten.
- [ ] **Rechner-Ansicht:** Ein interaktives Formular, das die ML-Preiseinschätzung live abfragt und anzeigt.

## ⚙️ Lokales Setup (How to run)

1. **Repository klonen:**
   `git clone https://github.com/DEIN_GITHUB_NAME/used-vehicle-analytics.git`
2. **Virtuelle Umgebung aktivieren & Pakete installieren:**
   `uv pip install pandas sqlalchemy psycopg2-binary faker`
3. **Daten generieren:**
   `python daten_generator.py`
4. **PostgreSQL Docker-Container starten:**
   `docker run --name auto-postgres -e POSTGRES_PASSWORD=meingeheimespasswort -p 5432:5432 -d postgres`
5. **ETL-Pipeline ausführen:**
   `python etl_pipeline.py`
