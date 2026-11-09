#!/usr/bin/env python3
"""
Boubane - Moteur d'Enrichissement Approfondi & Audit Web des Prospects
=====================================================================
1. Audit réel de présence web (détection de nom de domaine indépendant vs annuaire)
2. Détection de la stack technique (WordPress, Elementor, Wix, Sur-mesure...)
3. Qualification téléphonique (Mobile 06/07 vs Fixe 02)
4. Filtrage géographique (Cœur Segréen 49/53 vs Hors-zone)
5. Rédaction de l'accroche ultra-humaine adaptée à la situation RÉELLE de l'artisan
6. Synchronisation Twenty CRM PostgreSQL (VPS) & CSV locaux
"""

import sys
import os
import re
import json
import time
import ssl
import subprocess
import urllib.request
import urllib.parse
from urllib.parse import urlparse

# SSL context non-strict pour inspection des certificats parfois auto-signés
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

IGNORED_DOMAINS = [
    "pagesjaunes.fr", "societe.com", "infobel.com", "verif.com", "pappers.fr",
    "lefigaro.fr", "hoodspot.fr", "mappy.com", "facebook.com", "instagram.com",
    "linkedin.com", "annuaire-entreprises.data.gouv.fr", "manageo.fr", "kompass.com",
    "score3.fr", "solocal.com", "yelp.fr", "lavoixdunord.fr", "ouest-france.fr",
    "justacote.com", "actu.fr", "entreprises.lefigaro.fr", "annuaire.actionco.fr",
    "annuaire-mairie.fr", "cyber-artisan.fr", "qualibat.com", "capeb.fr",
    "ffbatiment.fr", "bilan-gratuit.fr", "e-pro.fr", "batirama.com", "bing.com",
    "google.com", "google.fr", "duckduckgo.com", "wikipedia.org", "youtube.com"
]

LOCAL_CITIES = [
    "SEGRE", "SEGRÉ", "SEGRE-EN-ANJOU", "SEGRÉ-EN-ANJOU BLEU", "CHATEAU-GONTIER",
    "CHÂTEAU-GONTIER", "CHATEAU-GONTIER-SUR-MAYENNE", "CRAON", "CHATEAUBRIANT",
    "CHÂTEAUBRIANT", "LE LION D'ANGERS", "LE LION-D'ANGERS", "CANDE", "CANDÉ",
    "OMBREE D'ANJOU", "OMBRÉE D'ANJOU", "POUANCE", "POUANCÉ", "COMBREE", "COMBRÉE",
    "NOYANT-LA-GRAVOYERE", "LOIRAUGUENCE", "GREZ-EN-BOUERE", "BIERNE", "AZE", "AZÉ",
    "MARIGNE-PEUTON", "VILLIERS-CHARLEMAGNE", "MESLAY-DU-MAINE", "GENNES-LONGUEFUYE",
    "SAINT-FORT", "ANGRIE", "LOIRE-AUTHION", "BEAUCOUZE", "ANGERS", "AVIRE", "AVIRÉ"
]

def clean_company_name(name: str) -> str:
    """Nettoie le nom de l'entreprise pour la recherche web"""
    if not name:
        return ""
    # Retirer les formes juridiques
    clean = re.sub(r"\b(SARL|SAS|SASU|EURL|EI|SA|ETS|ETABLISSEMENTS|SOCIETE)\b", "", name, flags=re.IGNORECASE)
    # Retirer les parenthèses d'activité
    clean = re.sub(r"\(.*?\)", "", clean)
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean

def normalize_phone(phone_str: str) -> dict:
    """Normalise et catégorise le numéro de téléphone"""
    if not phone_str:
        return {"raw": "", "formatted": "", "type": "NONE", "can_sms": False}
    
    digits = re.sub(r"[^0-9]", "", str(phone_str))
    # Cas numéros français à 9 chiffres sans le 0 initial
    if len(digits) == 9 and digits.startswith(("6", "7", "1", "2", "3", "4", "5", "9")):
        digits = "0" + digits
    elif len(digits) == 11 and digits.startswith("33"):
        digits = "0" + digits[2:]
        
    if len(digits) != 10:
        return {"raw": phone_str, "formatted": phone_str, "type": "UNKNOWN", "can_sms": False}
        
    formatted = f"{digits[0:2]} {digits[2:4]} {digits[4:6]} {digits[6:8]} {digits[8:10]}"
    if digits.startswith(("06", "07")):
        return {"raw": phone_str, "formatted": formatted, "type": "MOBILE", "can_sms": True, "digits": digits}
    else:
        return {"raw": phone_str, "formatted": formatted, "type": "LANDLINE", "can_sms": False, "digits": digits}

def check_direct_domains(company_name: str, city: str):
    """Teste les domaines directs évidents comme maconnerie-west-anjou.fr"""
    clean = clean_company_name(company_name).lower()
    # slug
    slug = re.sub(r"[^a-z0-9]+", "-", clean).strip("-")
    candidates = [
        f"https://{slug}.fr",
        f"https://www.{slug}.fr",
        f"https://{slug}.com",
        f"https://www.{slug}.com",
    ]
    city_slug = re.sub(r"[^a-z0-9]+", "-", city.lower()).strip("-")
    if city_slug:
        candidates.append(f"https://{slug}-{city_slug}.fr")
        
    for url in candidates:
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=3.0, context=CTX) as resp:
                if resp.status == 200:
                    return resp.geturl()
        except Exception:
            continue
    return None

def search_duckduckgo_site(company_name: str, city: str):
    """Recherche sur DuckDuckGo pour identifier le site officiel"""
    clean_name = clean_company_name(company_name)
    query = f"\"{clean_name}\" {city} site officiel"
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=4.5, context=CTX) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            raw_links = re.findall(r"uddg=([^&]+)", html)
            links = [urllib.parse.unquote(l) for l in raw_links]
            for link in links:
                try:
                    parsed = urlparse(link)
                    domain = parsed.netloc.lower()
                    if not domain or domain.startswith("duckduckgo"):
                        continue
                    if any(ignored in domain for ignored in IGNORED_DOMAINS):
                        continue
                    # Si c'est un domaine propre valide
                    if "." in domain:
                        return f"{parsed.scheme}://{parsed.netloc}"
                except Exception:
                    continue
    except Exception:
        pass
    return None

def audit_website_tech(url: str):
    """Vérifie le site web trouvé, détecte CMS, titre et temps de réponse"""
    if not url:
        return None
    start = time.time()
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=5.0, context=CTX) as resp:
            elapsed = time.time() - start
            final_url = resp.geturl()
            html = resp.read().decode("utf-8", errors="ignore")
            
            # Détection CMS & frameworks
            tech = []
            if "wp-content" in html or "wp-includes" in html or "wordpress" in html.lower():
                tech.append("WordPress")
            if "elementor" in html.lower():
                tech.append("Elementor")
            if "wix.com" in html or "wixsite" in html:
                tech.append("Wix")
            if "squarespace" in html:
                tech.append("Squarespace")
            if "solocal" in html or "pagesjaunes" in html:
                tech.append("Solocal/PagesJaunes")
            if "webflow" in html:
                tech.append("Webflow")
            if not tech:
                tech.append("Custom / HTML")
                
            title_m = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
            title = title_m.group(1).strip() if title_m else ""
            
            # Classification de l'état du site
            if "Elementor" in tech or "Wix" in tech or "Solocal/PagesJaunes" in tech or elapsed > 2.0:
                classification = "OUTDATED_OR_SLOW"
            elif "WordPress" in tech:
                classification = "WORDPRESS_TRADITIONAL"
            else:
                classification = "MODERN_OR_CUSTOM"
                
            return {
                "url": final_url,
                "status": resp.status,
                "elapsed_sec": round(elapsed, 2),
                "tech": tech,
                "title": title[:100],
                "classification": classification
            }
    except Exception as e:
        return {
            "url": url,
            "status": "ERROR",
            "error": str(e),
            "classification": "UNREACHABLE"
        }

def craft_humanizer_pitch(lead: dict, website_info: dict, phone_info: dict) -> dict:
    """Rédige une proposition commerciale chirurgicale, 100% humaine, adaptée à la réalité"""
    name = lead.get("contact_name") or lead.get("first_name") or "Bonjour"
    company = lead.get("comp_name") or "votre entreprise"
    city = lead.get("city") or "votre secteur"
    trade = lead.get("craft") or "artisanat du bâtiment"
    
    first_name = lead.get("first_name") or ""
    if first_name and not first_name.lower().startswith("gérant") and len(first_name) < 20:
        salutation = f"Bonjour {first_name},"
    else:
        salutation = "Bonjour,"

    # CAS 1 : Aucun site web détecté
    if not website_info or website_info.get("classification") in ("UNREACHABLE", "NO_WEBSITE"):
        angle = "Création Complète 0€ (Aucun site existant)"
        pitch_sms_whatsapp = (
            f"{salutation}\n\n"
            f"J'ai vu vos réalisations sur {city}. Vous n'avez pas de site internet à vous pour montrer vos chantiers en photo aux particuliers du coin.\n\n"
            f"Je lance Boubane dans la région : je vous offre à 100 % la création de votre site vitrine sur-mesure (0 € de frais de création, vous restez 100 % propriétaire de votre code et nom de domaine).\n\n"
            f"En échange, je vous demande seulement un avis Google une fois le site en ligne.\n\n"
            f"Est-ce que ça vous dirait de voir une maquette sur votre téléphone cette semaine ?\n\n"
            f"Léo Saillour · Boubane (07 78 31 03 46)"
        )
        pitch_email = (
            f"{salutation}\n\n"
            f"Je suis tombé sur vos réalisations sur {city}. J'ai vu que vous n'aviez pas de site internet à vous pour montrer vos chantiers en photo aux particuliers qui cherchent un artisan.\n\n"
            f"Je lance Boubane dans le Segréen : je vous crée votre site vitrine gratuitement (0 € de frais de création, aucun abonnement caché). En contrepartie, je vous demande simplement un avis honnête sur Google une fois le site en ligne.\n\n"
            f"Est-ce que ça vous dirait de jeter un œil à une maquette sur votre téléphone cette semaine ?\n\n"
            f"Vous pouvez me répondre directement par retour de mail ou choisir 10 minutes ici si vous préférez : https://rdv.boubane.com\n\n"
            f"Bonne journée,\n\n"
            f"Léo Saillour\nBoubane\n07 78 31 03 46\nhttps://boubane.com"
        )
    # CAS 2 : Site existant lent ou sous WordPress/Elementor (ex: Maçonnerie West Anjou)
    elif website_info.get("classification") in ("OUTDATED_OR_SLOW", "WORDPRESS_TRADITIONAL"):
        site_url = website_info.get("url")
        tech_str = ", ".join(website_info.get("tech", []))
        angle = f"Modernisation & Vitesse Extrême (<0.4s vs {website_info.get('elapsed_sec', 2)}s actuel) – {tech_str}"
        pitch_sms_whatsapp = (
            f"{salutation}\n\n"
            f"J'ai regardé votre site internet ({site_url}) pour vos travaux sur {city}.\n\n"
            f"Il présente bien vos services, mais il est un peu lourd sur smartphone (moteur {tech_str}).\n\n"
            f"Je dirige Boubane dans le Segréen : je recode et modernise gratuitement votre site avec notre moteur ultra-rapide (< 0.4 seconde) et plein écran photo, à 0 € de frais.\n\n"
            f"Seriez-vous curieux de voir la différence sur une maquette de test sur votre téléphone ?\n\n"
            f"Léo Saillour · Boubane (07 78 31 03 46)"
        )
        pitch_email = (
            f"{salutation}\n\n"
            f"J'ai consulté votre site internet ({site_url}) concernant vos prestations sur {city}.\n\n"
            f"Vos réalisations méritent d'être mises en valeur avec une vitesse de chargement instantanée sur mobile. Actuellement, la structure {tech_str} ralentit l'affichage pour les clients qui vous cherchent sur smartphone.\n\n"
            f"Dans le cadre du lancement de Boubane dans la région, je vous propose de moderniser votre site sur notre moteur nouvelle génération sans framework lourd (< 0.4s de chargement), 100 % offert à la conception.\n\n"
            f"Est-ce que vous seriez ouvert à ce que je vous montre un comparatif visuel cette semaine ?\n\n"
            f"Bonne journée,\n\n"
            f"Léo Saillour\nBoubane\n07 78 31 03 46\nhttps://boubane.com"
        )
    # CAS 3 : Site moderne actif (ex: Menuiserie Cadeau)
    else:
        site_url = website_info.get("url")
        angle = "Automatisations IA & Traitement des demandes (Site déjà en place)"
        pitch_sms_whatsapp = (
            f"{salutation}\n\n"
            f"J'ai visité votre site ({site_url}) : vos réalisations sur {city} sont superbes et votre vitrine web est déjà très soignée.\n\n"
            f"Je dirige Boubane dans le coin : nous greffons des automatisations IA simples pour artisans (tri automatique des demandes de devis, assistant de boîte mail 24/7 et rappels de chantiers).\n\n"
            f"Avez-vous 5 minutes un de ces jours pour voir comment cela vous ferait gagner du temps le soir ?\n\n"
            f"Léo Saillour · Boubane (07 78 31 03 46)"
        )
        pitch_email = (
            f"{salutation}\n\n"
            f"Votre site internet ({site_url}) est très propre et vos réalisations d'agencement sur {city} sont impeccables.\n\n"
            f"Puisque votre présence web est déjà solide, Boubane peut vous accompagner sur la partie qui prend le plus de temps aux artisans le soir : la gestion administrative et le tri des demandes.\n\n"
            f"Nous installons des automatisations directes (réponses instantanées aux demandes de chantiers, qualification des projets et gestion de boîte mail).\n\n"
            f"Si vous souhaitez alléger votre charge mentale administrative, je serais ravi d'échanger 10 minutes avec vous : https://rdv.boubane.com\n\n"
            f"Bien cordialement,\n\n"
            f"Léo Saillour\nBoubane\n07 78 31 03 46\nhttps://boubane.com"
        )
        
    return {
        "angle": angle,
        "pitch_sms_whatsapp": pitch_sms_whatsapp,
        "pitch_email": pitch_email
    }

def main():
    print("=== DÉMARRAGE DU MOTEUR D'ENRICHISSEMENT APPROFONDI BOUBANE ===")
    
    # 1. Extraction des leads depuis Twenty CRM
    cmd = (
        "ssh -o BatchMode=yes leo@192.168.1.164 "
        "\"docker exec twenty-db-1 psql -U postgres -d default -t -A -F '|||' -c "
        "'SELECT o.id, c.id, c.name, c.\\\"addressAddressCity\\\", p.id, p.\\\"nameFirstName\\\", p.\\\"nameLastName\\\", p.\\\"phonesPrimaryPhoneNumber\\\", p.\\\"emailsPrimaryEmail\\\" "
        "FROM \\\"workspace_4afa97ewunu3hydfohpozj1e3\\\".opportunity o "
        "JOIN \\\"workspace_4afa97ewunu3hydfohpozj1e3\\\".company c ON o.\\\"companyId\\\" = c.id "
        "JOIN \\\"workspace_4afa97ewunu3hydfohpozj1e3\\\".person p ON o.\\\"pointOfContactId\\\" = p.id;'\""
    )
    
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Erreur extraction Twenty CRM: {res.stderr}")
        return
        
    lines = [l.strip() for l in res.stdout.strip().split("\n") if l.strip()]
    print(f"Extraction réussie : {len(lines)} opportunités trouvées dans Twenty CRM.")
    
    leads = []
    for line in lines:
        parts = line.split("|||")
        if len(parts) >= 9:
            opp_id, comp_id, comp_name, city, person_id, first_name, last_name, phone, email = parts[:9]
            leads.append({
                "opp_id": opp_id,
                "comp_id": comp_id,
                "comp_name": comp_name,
                "city": city or "Segré",
                "person_id": person_id,
                "first_name": first_name,
                "last_name": last_name,
                "phone": phone,
                "email": email
            })
            
    print("\nLancement de l'audit approfondi de présence web...")
    
    enriched_results = []
    stats = {
        "total": len(leads),
        "local": 0,
        "out_of_zone": 0,
        "has_website": 0,
        "no_website": 0,
        "mobile_phone": 0,
        "landline_phone": 0,
        "no_phone": 0
    }
    
    for idx, lead in enumerate(leads, 1):
        comp_name = lead["comp_name"]
        city = lead["city"]
        
        # Test zone géographique
        city_upper = city.upper()
        is_local = any(loc in city_upper for loc in LOCAL_CITIES)
        if is_local:
            stats["local"] += 1
        else:
            stats["out_of_zone"] += 1
            
        # Qualification téléphone
        phone_info = normalize_phone(lead["phone"])
        if phone_info["type"] == "MOBILE":
            stats["mobile_phone"] += 1
        elif phone_info["type"] == "LANDLINE":
            stats["landline_phone"] += 1
        else:
            stats["no_phone"] += 1
            
        print(f"[{idx}/{len(leads)}] {comp_name} ({city}) ... ", end="", flush=True)
        
        # Cas spécial connu identifié par l'utilisateur
        website_url = None
        if "WEST ANJOU" in comp_name.upper():
            website_url = "https://maconnerie-west-anjou.fr/"
        elif "MENU" in comp_name.upper() and "CADEAU" in comp_name.upper():
            website_url = "https://menuiseriecadeau.fr/"
        else:
            # 1. Test domaines directs
            website_url = check_direct_domains(comp_name, city)
            # 2. Test recherche DuckDuckGo
            if not website_url:
                website_url = search_duckduckgo_site(comp_name, city)
                
        website_audit = audit_website_tech(website_url) if website_url else None
        
        if website_audit and website_audit.get("status") == 200:
            stats["has_website"] += 1
            print(f"🌐 SITE DÉTECTÉ: {website_audit['url']} ({','.join(website_audit['tech'])})")
        else:
            stats["no_website"] += 1
            website_audit = {"status": "NO_WEBSITE", "classification": "NO_WEBSITE", "url": ""}
            print("❌ AUCUN SITE (Cible 0€)")
            
        pitch_data = craft_humanizer_pitch(lead, website_audit, phone_info)
        
        enriched_item = {
            "lead": lead,
            "is_local": is_local,
            "phone_info": phone_info,
            "website_audit": website_audit,
            "pitch_data": pitch_data
        }
        enriched_results.append(enriched_item)
        
        # Pause légère pour respecter les requêtes web
        time.sleep(0.3)
        
    # Enregistrement des résultats complets en local
    os.makedirs("scratch", exist_ok=True)
    with open("scratch/leads_enriched_deep.json", "w", encoding="utf-8") as f:
        json.dump(enriched_results, f, ensure_ascii=False, indent=2)
        
    print("\n" + "="*70)
    print("BILAN DE L'AUDIT APPROFONDI DE PROSPECTION :")
    print("="*70)
    print(f"Total des dossiers audités          : {stats['total']}")
    print(f"Artisans dans la zone cible (49/53) : {stats['local']}")
    print(f"Entreprises hors zone               : {stats['out_of_zone']}")
    print(f"Numéros de mobile direct (06/07)    : {stats['mobile_phone']}")
    print(f"Lignes fixes (02)                   : {stats['landline_phone']}")
    print(f"Sans téléphone direct               : {stats['no_phone']}")
    print(f"Sites web réels détectés            : {stats['has_website']}")
    print(f"Sans aucun site web (Cible 0€ pure) : {stats['no_website']}")
    print("="*70)
    print(f"Fichier de référence généré : scratch/leads_enriched_deep.json")

if __name__ == "__main__":
    main()

