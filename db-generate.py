import csv
import random
from faker import Faker

fake = Faker('de_DE')

# Feste Liste an Großstädten für realistische Ballungsräume im Dashboard
STAEDTE = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", "Hannover", "Nürnberg"]

# --- DATENBASIS AUTOS (Mit Gewichten und realistischen Basispreisen) ---
# Format: "Marke": {"weight": Marktanteil, "base_min": Min-Preis Neu, "base_max": Max-Preis Neu, "modelle": [...]}
AUTOS = {
    "Volkswagen": {"weight": 20, "base": (15000, 50000), "modelle": ["Golf", "Polo", "Passat", "Tiguan", "T-Roc", "Arteon"]},
    "BMW": {"weight": 15, "base": (35000, 90000), "modelle": ["3er", "5er", "1er", "X3", "X5", "4er"]},
    "Audi": {"weight": 15, "base": (30000, 85000), "modelle": ["A3", "A4", "A6", "Q3", "Q5", "Q7"]},
    "Mercedes-Benz": {"weight": 15, "base": (35000, 95000), "modelle": ["C-Klasse", "E-Klasse", "A-Klasse", "GLC", "GLE"]},
    "Skoda": {"weight": 8, "base": (15000, 40000), "modelle": ["Octavia", "Fabia", "Superb", "Kodiaq", "Kamiq"]},
    "Ford": {"weight": 7, "base": (15000, 45000), "modelle": ["Focus", "Fiesta", "Kuga", "Puma", "Mustang Mach-E"]},
    "Toyota": {"weight": 6, "base": (18000, 50000), "modelle": ["Yaris", "Corolla", "RAV4", "C-HR", "Aygo"]},
    "Porsche": {"weight": 3, "base": (70000, 160000), "modelle": ["911", "Cayenne", "Macan", "Taycan", "Panamera"]},
    "Tesla": {"weight": 4, "base": (40000, 110000), "modelle": ["Model 3", "Model Y", "Model S", "Model X"]},
    "Renault": {"weight": 4, "base": (12000, 35000), "modelle": ["Clio", "Megane", "Captur", "Zoe"]},
    "Seat": {"weight": 3, "base": (15000, 35000), "modelle": ["Leon", "Ibiza", "Ateca", "Tarraco"]}
}

# --- DATENBASIS MOTORRÄDER ---
MOTORRAEDER = {
    "Yamaha": {"weight": 20, "base": (5000, 18000), "modelle": ["MT-07", "YZF-R1", "Tenere 700", "Tracer 9", "MT-09"]},
    "Honda": {"weight": 20, "base": (4000, 20000), "modelle": ["CBR1000RR", "Africa Twin", "CB650R", "Rebel 500", "NC750X"]},
    "Kawasaki": {"weight": 15, "base": (5000, 19000), "modelle": ["Ninja 400", "Z900", "Versys 650", "Ninja ZX-10R", "Z650"]},
    "BMW Motorrad": {"weight": 18, "base": (8000, 25000), "modelle": ["R 1250 GS", "S 1000 RR", "F 850 GS", "G 310 R", "R nineT"]},
    "Ducati": {"weight": 10, "base": (12000, 30000), "modelle": ["Panigale V4", "Monster", "Multistrada V4", "Streetfighter V4", "Diavel"]},
    "KTM": {"weight": 12, "base": (5000, 22000), "modelle": ["390 Duke", "890 Adventure", "1290 Super Duke R", "RC 390", "1290 Super Adventure"]},
    "Harley-Davidson": {"weight": 5, "base": (15000, 35000), "modelle": ["Sportster S", "Fat Boy", "Street Glide", "Pan America"]}
}

ANZAHL_FAHRZEUGE = 200000

print(f"Starte realistische Datensimulation von {ANZAHL_FAHRZEUGE} Fahrzeugen...")

with open('fahrzeuge_mock_data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['ID', 'Fahrzeugtyp', 'Marke', 'Modell', 'Baujahr', 'Kilometerstand', 'Kraftstoff', 'Getriebe', 'Preis_Euro', 'Standort'])

    # Listen und Gewichte für die random.choices vorbereiten
    auto_keys = list(AUTOS.keys())
    auto_weights = [AUTOS[k]["weight"] for k in auto_keys]
    
    moto_keys = list(MOTORRAEDER.keys())
    moto_weights = [MOTORRAEDER[k]["weight"] for k in moto_keys]

    for i in range(1, ANZAHL_FAHRZEUGE + 1):
        ist_auto = random.random() < 0.80 # 80% Autos, 20% Motorräder
        
        baujahr = random.randint(2005, 2026)
        alter = 2026 - baujahr
        
        if ist_auto:
            fahrzeugtyp = "Auto"
            marke = random.choices(auto_keys, weights=auto_weights, k=1)[0]
            modell = random.choice(AUTOS[marke]["modelle"])
            
            # Kraftstoff realistisch (Mehr Diesel bei älteren Autos, mehr Elektro bei neuen)
            if marke == "Tesla":
                kraftstoff = "Elektro"
                getriebe = "Automatik"
            else:
                if alter < 4:
                    kraftstoff = random.choices(["Benzin", "Diesel", "Hybrid", "Elektro"], weights=[40, 25, 20, 15])[0]
                else:
                    kraftstoff = random.choices(["Benzin", "Diesel", "Hybrid", "Elektro"], weights=[55, 40, 4, 1])[0]
                
                # Getriebe (Neuere Autos & Premium-Marken öfter Automatik)
                if marke in ["Mercedes-Benz", "Porsche", "Audi", "BMW"] or alter < 5:
                    getriebe = random.choices(["Automatik", "Manuell"], weights=[75, 25])[0]
                else:
                    getriebe = random.choices(["Automatik", "Manuell"], weights=[40, 60])[0]

            basis_preis = random.randint(AUTOS[marke]["base"][0], AUTOS[marke]["base"][1])
            km_pro_jahr = random.randint(8000, 25000)
            
        else:
            fahrzeugtyp = "Motorrad"
            marke = random.choices(moto_keys, weights=moto_weights, k=1)[0]
            modell = random.choice(MOTORRAEDER[marke]["modelle"])
            kraftstoff = "Benzin" if marke != "Harley-Davidson" else random.choices(["Benzin", "Elektro"], weights=[95, 5])[0]
            getriebe = "Manuell"
            
            basis_preis = random.randint(MOTORRAEDER[marke]["base"][0], MOTORRAEDER[marke]["base"][1])
            km_pro_jahr = random.randint(2000, 8000)

        # 1. Kilometerstand berechnen (nicht stur linear, sondern mit etwas Varianz)
        kilometerstand = int((alter * km_pro_jahr) * random.uniform(0.8, 1.2)) + random.randint(0, 2000)

        # 2. DER PREIS FÜR DAS MACHINE LEARNING (Das Gehirn)
        # a) Wertverlust durch Alter (ca. 10-15% pro Jahr, Motorräder und Porsche sind wertstabiler)
        depreciation_rate = 0.88 if fahrzeugtyp == "Motorrad" or marke == "Porsche" else 0.85
        alter_faktor = depreciation_rate ** alter
        
        # b) Wertverlust durch Kilometer (Ein Auto mit 250k km verliert massiv an Wert, verglichen mit einem mit 50k km)
        max_km = 300000 if ist_auto else 100000
        km_faktor = max(0.3, 1.0 - (kilometerstand / max_km)) # Fällt auf maximal 30% des Restwerts
        
        # c) Zufälliges "Rauschen" (Zustand, Ausstattung, Unfallwagen etc. +/- 15%)
        noise = random.uniform(0.85, 1.15)
        
        # Finale Preis-Berechnung
        preis = int(basis_preis * alter_faktor * km_faktor * noise)
        preis = max(500, preis) # Kein Fahrzeug kostet unter 500 Euro
        
        # 3. Standort (70% Chance auf Großstadt, 30% Chance auf Faker-Kleinstadt)
        if random.random() < 0.70:
            standort = random.choice(STAEDTE)
        else:
            standort = fake.city()

        writer.writerow([i, fahrzeugtyp, marke, modell, baujahr, kilometerstand, kraftstoff, getriebe, preis, standort])

print("Fertig! Deine hochgradig realistischen ML-Daten wurden generiert.")