import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import time

print("🤖 Starte KI-Training (Machine Learning Pipeline)...")

# --- 1. DATEN AUS DER DATENBANK LADEN ---
print("Lade Daten aus der PostgreSQL-Datenbank...")
db_url = 'postgresql://postgres:meingeheimespasswort@localhost:5432/postgres'
engine = create_engine(db_url)

# Wir holen uns alle Fahrzeuge aus der Datenbank
query = "SELECT fahrzeugtyp, marke, baujahr, kilometerstand, kraftstoff, getriebe, preis_euro FROM fahrzeuge"
df = pd.read_sql(query, engine)

print(f"Erfolgreich {len(df)} Fahrzeuge geladen.")

# --- 2. DATEN VORBEREITEN (Feature Engineering) ---
print("Bereite Daten für die KI vor (Wörter in Zahlen übersetzen)...")

# Wir berechnen das Alter (KI mag Alter lieber als konkrete Baujahre)
df['alter'] = 2026 - df['baujahr']

# Die KI versteht keine Wörter wie "VW" oder "Manuell". 
# pd.get_dummies macht daraus für jede Marke eine Spalte mit 0 oder 1 (One-Hot-Encoding)
features = ['fahrzeugtyp', 'marke', 'kraftstoff', 'getriebe', 'alter', 'kilometerstand']
X = pd.get_dummies(df[features], drop_first=True) # X sind unsere Merkmale
y = df['preis_euro'] # y ist unser Ziel (Der Preis, den wir vorhersagen wollen)

# Wir merken uns die Spaltennamen, damit die API später weiß, wie die Daten aussehen müssen
model_columns = list(X.columns)
joblib.dump(model_columns, 'model_columns.pkl')

# --- 3. DATEN AUFTEILEN (Trainings- und Test-Set) ---
# Wir geben der KI 80% der Daten zum Lernen. 20% verstecken wir, um sie danach zu testen!
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- 4. DAS MODELL TRAINIEREN ---
print("Trainiere den Random Forest Algorithmus (Das kann jetzt ca. 1-2 Minuten dauern)...")
start_time = time.time()

# Ein Random Forest baut hunderte kleine Entscheidungsbäume und lässt sie abstimmen
modell = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
modell.fit(X_train, y_train)

dauer = time.time() - start_time
print(f"Training abgeschlossen in {dauer:.1f} Sekunden!")

# --- 5. DAS MODELL TESTEN (Die Stunde der Wahrheit) ---
print("Teste das Modell mit den 20% versteckten Daten...")
vorhersagen = modell.predict(X_test)

# MAE: Um wie viel Euro verschätzt sich die KI im Durchschnitt?
mae = mean_absolute_error(y_test, vorhersagen)
# R2-Score: Wie viel Prozent der Preisunterschiede hat die KI kapiert? (1.0 = 100% perfekt)
r2 = r2_score(y_test, vorhersagen)

print("-" * 30)
print("📊 ERGEBNISSE:")
print(f"Durchschnittliche Abweichung (MAE): {mae:.2f} €")
print(f"Modell-Genauigkeit (R²): {r2:.4f} (Je näher an 1.0, desto besser)")
print("-" * 30)

# --- 6. MODELL SPEICHERN ---
print("Speichere das trainierte 'Gehirn' auf der Festplatte...")
joblib.dump(modell, 'preis_vorhersage_modell.pkl')
print("Fertig! Das Modell liegt nun als 'preis_vorhersage_modell.pkl' bereit für deine API.")