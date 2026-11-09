#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Boubane - Moteur de Prospection & Scraping Local
Permet d'extraire des artisans et entreprises locales sans site web sur n'importe quelle commune française.
"""

import argparse
import csv
import json
import os
import re
import sys
import urllib.parse
import urllib.request

CRAFT_TRANSLATIONS = {
    "carpenter": "Menuiserie & Charpente",
    "electrician": "Électricité & Domotique",
    "plumber": "Plomberie & Chauffage",
    "mason": "Maçonnerie & Gros œuvre",
    "roofer": "Couverture & Toiture",
    "painter": "Peinture & Décoration",
    "tiler": "Carrelage & Revêtement",
    "gardener": "Aménagement Paysager",
    "metal_construction": "Métallerie & Serrurerie",
    "hvac": "Chauffage & Climatisation",
    "builder": "Rénovation & Bâtiment",
    "glaziery": "Miroiterie & Vitrerie",
    "insulation": "Isolation & Rénovation énergétique"
}

def clean_phone(phone_str):
    if not phone_str:
        return ""
    # Standardiser le format FR
    cleaned = re.sub(r"[^\d+]", "", phone_str)
    if cleaned.startswith("+33"):
        cleaned = "0" + cleaned[3:]
    if len(cleaned) == 10:
        return f"{cleaned[0:2]} {cleaned[2:4]} {cleaned[4:6]} {cleaned[6:8]} {cleaned[8:10]}"
    return phone_str

def generate_accroche(entreprise, metier, ville):
    return (
        f"Bonjour {entreprise}, j'ai repéré votre savoir-faire en {metier.lower()} sur le secteur de {ville}. "
        f"Vous n'avez pas de vitrine web officielle pour présenter vos réalisations. "
        f"Je lance Boubane : je vous offre la réalisation de votre site vitrine sur-mesure (0 € frais de création). "
        f"Auriez-vous 2 minutes pour jeter un œil à une maquette ?"
    )

def query_overpass(ville, rayon_km=15):
    print(f"[*] Recherche des artisans autour de {ville} (rayon ~{rayon_km} km)...")
    
    # Géocodage de la ville via Nominatim
    user_agent = "BoubaneScraper/1.0 (contact@boubane.com)"
    nominatim_url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(ville)}&format=json&limit=1&countrycodes=fr"
    req = urllib.request.Request(nominatim_url, headers={"User-Agent": user_agent})
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if not data:
                print(f"[!] Ville '{ville}' non trouvée.")
                return []
            lat = float(data[0]["lat"])
            lon = float(data[0]["lon"])
    except Exception as e:
        print(f"[!] Erreur géocodage: {e}")
        return []

    print(f"[+] Coordonnées trouvées pour {ville} : {lat}, {lon}")
    
    # Requête Overpass pour les métiers d'artisanat
    radius_meters = rayon_km * 1000
    overpass_query = f"""
    [out:json][timeout:25];
    (
      node["craft"](around:{radius_meters},{lat},{lon});
      way["craft"](around:{radius_meters},{lat},{lon});
      relation["craft"](around:{radius_meters},{lat},{lon});
    );
    out body;
    >;
    out skel qt;
    """
    
    overpass_url = "https://overpass-api.de/api/interpreter"
    req_overpass = urllib.request.Request(
        overpass_url,
        data=f"data={urllib.parse.quote(overpass_query)}".encode("utf-8"),
        headers={"User-Agent": user_agent}
    )
    
    results = []
    try:
        with urllib.request.urlopen(req_overpass, timeout=30) as resp:
            raw = json.loads(resp.read().decode("utf-8"))
            elements = raw.get("elements", [])
            print(f"[+] {len(elements)} éléments bruts récupérés via Overpass.")
            
            seen_names = set()
            for el in elements:
                tags = el.get("tags", {})
                name = tags.get("name")
                if not name or name in seen_names:
                    continue
                seen_names.add(name)
                
                craft = tags.get("craft", "")
                metier = CRAFT_TRANSLATIONS.get(craft, craft.capitalize() if craft else "Artisanat BTP")
                
                phone = tags.get("phone") or tags.get("contact:phone") or tags.get("contact:mobile") or ""
                phone_cleaned = clean_phone(phone)
                
                website = tags.get("website") or tags.get("contact:website") or ""
                
                street = tags.get("addr:street", "")
                housenumber = tags.get("addr:housenumber", "")
                postcode = tags.get("addr:postcode", "")
                city = tags.get("addr:city") or ville
                
                adresse = f"{housenumber} {street}, {postcode} {city}".strip().lstrip(",").strip()
                if not adresse or adresse == ville:
                    adresse = f"Secteur {ville}"
                    
                situation_web = "Site existant" if website else "Aucun site web (Prioritaire 0€)"
                accroche = generate_accroche(name, metier, city)
                
                results.append({
                    "Entreprise": name,
                    "Métier": metier,
                    "Téléphone": phone_cleaned if phone_cleaned else "À chercher (Annuaire)",
                    "Adresse": adresse,
                    "Situation Web": situation_web,
                    "Statut": "À contacter",
                    "Notes & Angle d'approche": f"Artisanat {metier} - Offre de lancement Boubane",
                    "Message d'Accroche": accroche
                })
                
    except Exception as e:
        print(f"[!] Erreur Overpass: {e}")
        return []

    return results

def main():
    parser = argparse.ArgumentParser(description="Boubane - Scraper d'artisans locaux sans site web")
    parser.add_argument("--ville", required=True, help="Nom de la commune cible (ex: Segré, Château-Gontier, Craon, Châteaubriant)")
    parser.add_argument("--rayon", type=int, default=15, help="Rayon de recherche en km (défaut: 15)")
    parser.add_argument("--output", default=None, help="Fichier CSV de sortie")
    parser.add_argument("--sans-site-uniquement", action="store_true", help="Ne garder que les entreprises sans site web")

    args = parser.parse_args()
    
    leads = query_overpass(args.ville, args.rayon)
    if not leads:
        print("[!] Aucun artisan trouvé sur cette zone.")
        return

    if args.sans_site_uniquement:
        leads = [l for l in leads if "Aucun site web" in l["Situation Web"]]

    output_path = args.output or f"leads_{args.ville.lower().replace(' ', '_')}.csv"
    
    # Enregistrement CSV UTF-8
    fieldnames = [
        "Entreprise", "Métier", "Téléphone", "Adresse", 
        "Situation Web", "Statut", "Notes & Angle d'approche", "Message d'Accroche"
    ]
    
    with open(output_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(leads)

    print(f"\n[✓] Succès ! {len(leads)} artisans exportés dans : {output_path}")

if __name__ == "__main__":
    main()
