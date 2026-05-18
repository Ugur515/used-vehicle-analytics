import csv
import random
from faker import Faker

# Faker initialisieren (für deutsche Städtenamen)
fake = Faker('de_DE')

# --- DATENBASIS ---
auto_marken = {
    "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan"],
    "BMW": ["3er", "5er", "X3", "1er"],
    "Audi": ["A3", "A4", "A6", "Q5"],
    "Mercedes-Benz": ["C-Klasse", "E-Klasse", "A-Klasse", "GLC"],
    "Toyota": ["Yaris", "Corolla", "RAV4", "Aygo"],
    "Ford": ["Focus", "Fiesta", "Kuga", "Puma"]
}

motorrad_marken = {
    "Yamaha": ["MT-07", "YZF-R1", "Tenere 700", "Tracer 9"],
    "Honda": ["CBR1000RR", "Africa Twin", "CB650R", "Rebel 500"],
    "Kawasaki": ["Ninja 400", "Z900", "Versys 650", "Ninja ZX-10R"],
    "BMW Motorrad": ["R 1250 GS", "S 1000 RR", "F 850 GS", "G 310 R"],
    "Ducati": ["Panigale V4", "Monster", "Multistrada V4", "Streetfighter V4"],
    "KTM": ["390 Duke", "890 Adventure", "1290 Super Duke R", "RC 390"]
}

# Wie viele Fahrzeuge insgesamt?
ANZAHL_FAHRZEUGE = 200000

print(f"Starte Generierung von {ANZAHL_FAHRZEUGE} Fahrzeugen. Bitte warten...")

with open('fahrzeuge_mock_data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    
    # Die Kopfzeile (Jetzt mit 'Fahrzeugtyp')
    writer.writerow(['ID', 'Fahrzeugtyp', 'Marke', 'Modell', 'Baujahr', 'Kilometerstand', 'Kraftstoff', 'Getriebe', 'Preis_Euro', 'Standort'])

    for i in range(1, ANZAHL_FAHRZEUGE + 1):
        # 1. Entscheiden: Auto oder Motorrad? (z.B. 75% Autos, 25% Motorräder)
        ist_auto = random.random() < 0.75 
        
        if ist_auto:
            fahrzeugtyp = "Auto"
            marke = random.choice(list(auto_marken.keys()))
            modell = random.choice(auto_marken[marke])
            kraftstoff_art = random.choice(["Benzin", "Diesel", "Elektro", "Hybrid"])
            getriebe_art = random.choice(["Manuell", "Automatik"])
            basis_preis = random.randint(20000, 60000)
            km_pro_jahr = random.randint(10000, 20000) # Autos fahren viel
        else:
            fahrzeugtyp = "Motorrad"
            marke = random.choice(list(motorrad_marken.keys()))
            modell = random.choice(motorrad_marken[marke])
            kraftstoff_art = random.choice(["Benzin", "Benzin", "Elektro"]) # Motorräder fast immer Benzin
            getriebe_art = random.choice(["Manuell", "Manuell", "Automatik"]) # Motorräder fast immer Manuell
            basis_preis = random.randint(5000, 25000) # Geringerer Basispreis
            km_pro_jahr = random.randint(3000, 8000) # Motorräder fahren weniger KM pro Jahr
            
        # 2. Baujahr auswürfeln (bis zum aktuellen Jahr 2026)
        baujahr = random.randint(2005, 2026)
        alter = 2026 - baujahr
        
        # 3. Kilometerstand anhand des Alters und des Fahrzeugtyps berechnen
        kilometerstand = alter * km_pro_jahr + random.randint(0, 5000)
        
        # 4. Preis berechnen (15% Wertverlust pro Jahr)
        preis = max(500, int(basis_preis * (0.85 ** alter)))
        
        # 5. Standort erfinden
        standort = fake.city()
        
        # Zeile in die Datei schreiben
        writer.writerow([i, fahrzeugtyp, marke, modell, baujahr, kilometerstand, kraftstoff_art, getriebe_art, preis, standort])

print("Fertig! Die Datei 'fahrzeuge_mock_data.csv' wurde erstellt.")