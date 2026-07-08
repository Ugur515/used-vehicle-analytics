import pandas as pd
from sqlalchemy import create_engine

print("Starte ETL-Pipeline...")

# --- 1. EXTRACT (Daten extrahieren) ---
print("Lese CSV-Datei...")
# Pandas liest die gesamten 200.000 Zeilen in einen sogenannten "DataFrame"
df = pd.read_csv('fahrzeuge_mock_data.csv')

# --- 2. TRANSFORM (Daten transformieren/anpassen) ---
print("Passe Daten für die Datenbank an...")
# SQL mag keine Großbuchstaben in Spaltennamen. 
# Wir wandeln z.B. 'Fahrzeugtyp' in 'fahrzeugtyp' um.
df.columns = [col.lower() for col in df.columns]

# --- 3. LOAD (Daten in die Datenbank laden) ---
# Hier bauen wir die Verbindung auf: postgresql://USER:PASSWORT@HOST:PORT/DATENBANK_NAME
# In unserem Docker-Befehl war der User standardmäßig 'postgres' und die Datenbank 'postgres'
db_url = 'postgresql://postgres:meingeheimespasswort@localhost:5432/postgres'
engine = create_engine(db_url)

print("Lade 200.000 Fahrzeuge in die PostgreSQL-Datenbank (das dauert ca. 10-30 Sekunden)...")
# to_sql nimmt alle Daten und schreibt sie als neue Tabelle namens 'fahrzeuge' in die DB.
# if_exists='replace' bedeutet: Wenn wir das Skript nochmal ausführen, wird die alte Tabelle überschrieben.
df.to_sql('fahrzeuge', engine, if_exists='replace', index=False)

print("Erfolgreich! Alle Daten sind nun sicher in der Datenbank gespeichert.")