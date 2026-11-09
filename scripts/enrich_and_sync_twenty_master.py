#!/usr/bin/env python3
"""
Master enrichment, classification, pitch generation (Humanizer-compliant),
and Twenty CRM PostgreSQL synchronizer.
"""

import json
import uuid
import re
import subprocess
import os

VPS_HOST = "leo@192.168.1.164"
SSH_CMD = ["ssh", "-o", "StrictHostKeyChecking=no", VPS_HOST]

LOCAL_CITIES = {
    'SEGRE-EN-ANJOU BLEU', 'SEGRE', 'CHATEAU-GONTIER', 'CHATEAU-GONTIER-SUR-MAYENNE',
    'CRAON', 'CANDE', 'ANGRIE', 'CHALLAIN-LA-POTHERIE', 'OMBREE D\'ANJOU',
    'LE LION D\'ANGERS', 'LE LION-D\'ANGERS', 'CHATEAUBRIANT', 'ERBRAY',
    'MARIGNE-PEUTON', 'PREE-D\'ANJOU', 'COSSE-LE-VIVIEN', 'GREZ-EN-BOUERE',
    'MESLAY-DU-MAINE', 'BIERNE-LES-VILLAGES', 'CHATELAIN', 'VILLIERS-CHARLEMAGNE',
    'GENNES-LONGUEFUYE', 'LA GUERCHE-DE-BRETAGNE'
}

def clean_phone(phone_raw):
    if not phone_raw:
        return None, "NONE"
    p = re.sub(r'[^\d+]', '', str(phone_raw))
    if p.startswith('33') and len(p) >= 11:
        p = '0' + p[2:]
    elif not p.startswith('0') and len(p) == 9:
        p = '0' + p
    
    if len(p) == 10:
        formatted = f"{p[0:2]} {p[2:4]} {p[4:6]} {p[6:8]} {p[8:10]}"
        if p.startswith(('06', '07')):
            return formatted, "MOBILE"
        elif p.startswith(('01', '02', '03', '04', '05', '09')):
            return formatted, "LANDLINE"
    return phone_raw, "OTHER"

def get_trade_label(comp_name):
    cn = comp_name.lower()
    if 'maçon' in cn:
        return 'maçon'
    if 'couvert' in cn or 'couvreur' in cn:
        return 'couvreur'
    if 'menuis' in cn:
        return 'menuisier'
    if 'élec' in cn or 'elec' in cn:
        return 'électricien'
    if 'plomb' in cn or 'thermi' in cn or 'chauff' in cn:
        return 'plombier-chauffagiste'
    if 'peint' in cn:
        return 'peintre'
    if 'charpent' in cn:
        return 'charpentier'
    if 'paysag' in cn or 'vert' in cn:
        return 'paysagiste'
    if 'métal' in cn or 'tolerie' in cn or 'ferron' in cn:
        return 'métallier'
    return 'artisan'

def determine_web_status(item):
    wa = item.get('website_audit', {})
    url = wa.get('url', '')
    title = (wa.get('title') or '').lower()
    tech = wa.get('tech', [])
    comp_name = item['lead']['comp_name']
    
    parking_or_construction = [
        'site en construction', 'domain for sale', 'nom de domaine', 
        'sedo.com', 'hover realnames', 'lander', 'index of /', 'coming soon', 
        '近日中に公開', 'dovendi', 'cognix-systems', 'spotcom.fr'
    ]
    
    # Specific known edge cases
    if not url:
        return 'AUCUN_SITE_0€', None, None, "Aucun site web trouvé sur le web ou les registres"
        
    for kw in parking_or_construction:
        if kw in url.lower() or kw in title:
            return 'DOMAINE_INACTIF_OU_EN_CONSTRUCTION', url, tech, f"Nom de domaine réservé mais inactif ({kw})"
            
    if 'euroelec' in url and 'ile-de-france' in title:
        return 'HOMONYME_NON_PERTINENT', None, None, "Grossiste homonyme en Île-de-France"
    if 'alexandre.sh' in url:
        return 'HOMONYME_NON_PERTINENT', None, None, "Blog personnel sans lien avec l'artisan"
    if 'claas.com' in url:
        return 'HOMONYME_NON_PERTINENT', None, None, "Multinationale constructeur agricole"
    if 'ats.fr' in url:
        return 'HOMONYME_NON_PERTINENT', None, None, "Société homonyme hors sujet"
    if 'm-p-e.com' in url:
        return 'DOMAINE_INACTIF_OU_EN_CONSTRUCTION', url, tech, "Redirection vers page publicitaire de parking"
    if 'k-m.fr' in url:
        return 'DOMAINE_INACTIF_OU_EN_CONSTRUCTION', url, tech, "Domaine à vendre (nameshift)"
    if 'chevallier.fr' in url:
        return 'HOMONYME_NON_PERTINENT', None, None, "Site agence Spotcom non liée"

    # Real active sites
    if 'Elementor' in tech or 'Wix' in tech:
        return 'SITE_LOURD_REFONTE', url, tech, "Site lourd (Elementor / Wix) à moderniser pour la vitesse mobile"
    if 'WordPress' in tech:
        return 'SITE_WORDPRESS_REFONTE', url, tech, "Site WordPress traditionnel (maintenance & failles potentielles)"
    if 'dufourd-erbray.fr' in url or 'scierie-morvan.com' in url or 'bonsergent.fr' in url:
        return 'SITE_ANCIEN_REFONTE', url, tech, "Site ancien (XHTML/HTML des années 2010), non optimisé mobile"
        
    return 'SITE_MODERNE_AUTOMATION', url, tech, "Site moderne et réactif - Cible pour l'automatisation IA Boubane"

def clean_first_name(fn):
    if not fn or not fn.strip() or fn == 'Contact':
        return ""
    first = fn.strip().split()[0]
    first = first.replace('(', '').replace(')', '').strip().capitalize()
    return first

def generate_humanizer_pitches(comp_name, city, trade, status, url, tech, first_name):
    c_name = clean_first_name(first_name)
    salutation = f"Bonjour {c_name}," if c_name else "Bonjour,"
    display_city = city.replace("-", " ").title() if city else "votre secteur"
    
    # 1. AUCUN SITE WEB (0€)
    if status == 'AUCUN_SITE_0€':
        sms = (
            f"{salutation} Léo de Boubane à Segré. En cherchant des {trade}s sur {display_city}, "
            f"j'ai vu que vous étiez sur les annuaires mais sans site pour montrer vos chantiers. "
            f"Je crée votre site à 0 € sans abonnement imposé. Disponible 5 minutes pour en parler ? "
            f"Léo (07 78 31 03 46)"
        )
        email = f"""{salutation}

Je suis Léo Saillour, fondateur de Boubane à Segré-en-Anjou Bleu.

Quand un particulier cherche un {trade} sur {display_city}, votre entreprise apparaît sur les annuaires mais vous n'avez pas de site web pour présenter vos réalisations récentes et rassurer avant le premier contact.

Je crée des sites web professionnels pour les artisans du coin avec un modèle simple : la création est à 0 €, le code vous appartient et vous ne payez aucun abonnement d'hébergement captif.

Auriez-vous dix minutes cette semaine pour regarder ce que ça donnerait pour {comp_name} ?

Léo Saillour
Boubane - Segré-en-Anjou Bleu
07 78 31 03 46"""

    # 2. DOMAINE EN CONSTRUCTION OU INACTIF
    elif status == 'DOMAINE_INACTIF_OU_EN_CONSTRUCTION':
        clean_domain = url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0] if url else "votre domaine"
        sms = (
            f"{salutation} Léo de Boubane à Segré. J'ai vu que vous aviez le domaine {clean_domain} "
            f"mais qu'il affiche une page en attente ou en construction. "
            f"Les particuliers du secteur qui cliquent dessus tombent dans le vide. "
            f"On peut y mettre un vrai site rapide cette semaine si vous voulez. Léo (07 78 31 03 46)"
        )
        email = f"""{salutation}

Je suis Léo Saillour, basé à Segré-en-Anjou Bleu avec l'agence Boubane.

En préparant un dossier sur les entreprises locales de {display_city}, j'ai remarqué que votre adresse {clean_domain} affiche une page 'en construction' ou en attente d'hébergement. 

C'est dommage car les particuliers qui cherchent vos coordonnées ou veulent voir vos chantiers tombent sur une page blanche, alors que le nom vous appartient déjà.

Je peux vous déployer un site ultra-rapide et propre directement sur votre nom de domaine en 48 heures, sans engagement.

Seriez-vous partant pour échanger quelques minutes au téléphone ?

Léo Saillour
Boubane - Segré-en-Anjou Bleu
07 78 31 03 46"""

    # 3. SITE LOURD / ELEMENTOR / WIX (ex: Maçonnerie West Anjou)
    elif status in ('SITE_LOURD_REFONTE', 'SITE_WORDPRESS_REFONTE', 'SITE_ANCIEN_REFONTE'):
        clean_domain = url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0] if url else "votre site"
        tech_str = "Elementor" if "Elementor" in tech else ("Wix" if "Wix" in tech else "WordPress")
        sms = (
            f"{salutation} Léo de Boubane à Segré. J'ai regardé {clean_domain}. "
            f"Le contenu est propre mais le chargement rame pas mal sur smartphone à cause de {tech_str}. "
            f"Si vous voulez, je peux vous montrer comment l'alléger pour qu'il s'ouvre direct et capte plus d'appels. "
            f"Léo (07 78 31 03 46)"
        )
        email = f"""{salutation}

Je suis Léo Saillour, fondateur de Boubane à Segré-en-Anjou Bleu.

J'ai pris le temps de regarder votre site {clean_domain}. Vos réalisations sont bien documentées, mais la page met du temps à s'afficher sur smartphone parce qu'elle tourne sous {tech_str}.

Aujourd'hui la majorité des particuliers du Segréen font leur recherche sur téléphone depuis leur chantier ou leur salon. Un site qui met plus de deux secondes à réagir fait perdre des demandes directes au profit d'autres artisans.

Je conçois des sites légers qui s'ouvrent en moins d'une demi-seconde, sans maintenance lourde ni abonnement mensuel obligatoire.

Avez-vous un moment cette semaine pour que je vous montre la différence en direct ?

Léo Saillour
Boubane - Segré-en-Anjou Bleu
07 78 31 03 46"""

    # 4. SITE MODERNE ACTIF (ex: Menuiserie Cadeau)
    else:
        clean_domain = url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0] if url else "votre site"
        sms = (
            f"{salutation} Léo de Boubane à Segré. Votre site {clean_domain} est très bien fait et rapide. "
            f"Je développe des assistants pour artisans locaux pour trier les demandes de devis et caler les RDV automatiquement quand vous êtes en intervention. "
            f"Intéressé pour voir comment ça tourne ? Léo (07 78 31 03 46)"
        )
        email = f"""{salutation}

Je suis Léo Saillour, fondateur de Boubane à Segré-en-Anjou Bleu.

Félicitations pour votre site {clean_domain}, c'est l'un des rares du secteur à être vraiment propre et réactif.

Comme votre présence web est déjà solide, je vous contacte plutôt sur la gestion des demandes entrantes : quand vous êtes en déplacement ou sur un chantier, répondre aux e-mails et caler les visites prend un temps précieux.

J'installe chez les artisans du coin un système simple qui pré-qualifie les demandes de devis par e-mail et propose directement vos créneaux de visite sans que vous ayez à décrocher.

Seriez-vous ouvert à une démonstration rapide de 10 minutes ?

Léo Saillour
Boubane - Segré-en-Anjou Bleu
07 78 31 03 46"""

    return sms, email

def main():
    print("=== DÉMARRAGE DU TRAITEMENT MASTER BOUBANE ===")
    with open("scratch/leads_enriched_deep.json", "r") as f:
        raw_leads = json.load(f)
        
    print(f"Chargement de {len(raw_leads)} dossiers bruts.")
    
    processed_records = []
    
    p1_no_site = []
    p2_refonte = []
    p3_automation = []
    hors_zone = []
    
    for item in raw_leads:
        lead = item['lead']
        opp_id = lead['opp_id']
        comp_id = lead['comp_id']
        comp_name = lead['comp_name']
        city = (lead.get('city') or '').strip().upper()
        phone_raw = lead.get('phone')
        email = lead.get('email')
        first_name = lead.get('first_name')
        last_name = lead.get('last_name')
        
        # Phone analysis
        phone_fmt, phone_type = clean_phone(phone_raw)
        
        # City local check
        is_local = any(c in city for c in LOCAL_CITIES)
        
        # Trade
        trade = get_trade_label(comp_name)
        
        # Web status
        status, url, tech, audit_comment = determine_web_status(item)
        
        # Pitches
        sms_pitch, email_pitch = generate_humanizer_pitches(comp_name, city, trade, status, url, tech, first_name)
        
        record = {
            'opp_id': opp_id,
            'comp_id': comp_id,
            'comp_name': comp_name,
            'city': city,
            'is_local': is_local,
            'trade': trade,
            'first_name': first_name,
            'last_name': last_name,
            'phone': phone_fmt,
            'phone_type': phone_type,
            'email': email,
            'status': status,
            'url': url,
            'tech': tech or [],
            'audit_comment': audit_comment,
            'sms_pitch': sms_pitch,
            'email_pitch': email_pitch
        }
        processed_records.append(record)
        
        if not is_local or status == 'HOMONYME_NON_PERTINENT':
            hors_zone.append(record)
        elif status in ('AUCUN_SITE_0€', 'DOMAINE_INACTIF_OU_EN_CONSTRUCTION'):
            p1_no_site.append(record)
        elif status in ('SITE_LOURD_REFONTE', 'SITE_WORDPRESS_REFONTE', 'SITE_ANCIEN_REFONTE'):
            p2_refonte.append(record)
        else:
            p3_automation.append(record)

    print("\n--- STATISTIQUES GLOBALES APRÈS CONSOLIDATION ---")
    print(f"Total des dossiers : {len(processed_records)}")
    print(f"Priorité 1 - Cibles 0€ (Aucun site ou domaine inactif) : {len(p1_no_site)}")
    print(f"Priorité 2 - Refonte & Modernisation (Elementor, Wix, WP) : {len(p2_refonte)}")
    print(f"Priorité 3 - Automatisations IA (Sites modernes réactifs) : {len(p3_automation)}")
    print(f"Hors Zone ou Homonymes non pertinents : {len(hors_zone)}")
    
    # Save CSVs
    import csv
    
    fieldnames = [
        'comp_name', 'trade', 'city', 'phone', 'phone_type', 'email', 
        'status', 'url', 'tech', 'audit_comment', 'sms_pitch', 'email_pitch',
        'opp_id', 'comp_id'
    ]
    
    def write_csv(path, items):
        with open(path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
            writer.writeheader()
            for row in items:
                r = dict(row)
                r['tech'] = ", ".join(r['tech']) if isinstance(r['tech'], list) else r['tech']
                writer.writerow(r)
        print(f"Export CSV créé : {path} ({len(items)} lignes)")

    write_csv("scratch/prospects_priorite_1_locaux_sans_site.csv", p1_no_site)
    write_csv("scratch/prospects_priorite_2_refonte_et_modernisation.csv", p2_refonte)
    write_csv("scratch/prospects_priorite_3_automations_ia.csv", p3_automation)
    write_csv("scratch/prospects_hors_zone_ou_a_classer.csv", hors_zone)
    write_csv("scratch/master_prospects_enrichis_v2.csv", processed_records)
    
    # Generate SQL file for Twenty CRM PostgreSQL
    print("\nGénération du script de synchronisation SQL pour Twenty CRM...")
    sql_lines = ["BEGIN;"]
    
    # 1. Update company websites
    for r in processed_records:
        comp_id = r['comp_id']
        url = r['url']
        if url:
            domain_label = url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]
            sql_lines.append(f"""
UPDATE workspace_4afa97ewunu3hydfohpozj1e3.company 
SET "domainNamePrimaryLinkUrl" = '{url}',
    "domainNamePrimaryLinkLabel" = '{domain_label}',
    "updatedAt" = NOW()
WHERE id = '{comp_id}';
""")
        else:
            sql_lines.append(f"""
UPDATE workspace_4afa97ewunu3hydfohpozj1e3.company 
SET "domainNamePrimaryLinkUrl" = NULL,
    "domainNamePrimaryLinkLabel" = NULL,
    "updatedAt" = NOW()
WHERE id = '{comp_id}';
""")
            
    # 2. Add an Intelligence Audit Note for each opportunity
    # First, delete existing audit notes created by previous runs to avoid duplication
    sql_lines.append("""
DELETE FROM workspace_4afa97ewunu3hydfohpozj1e3.note
WHERE title LIKE '[Audit Boubane]%';
""")
    
    for r in processed_records:
        note_id = str(uuid.uuid4())
        target_comp_id = str(uuid.uuid4())
        target_opp_id = str(uuid.uuid4())
        
        title = f"[Audit Boubane] {r['status']} - {r['phone_type']}"
        markdown_body = f"""### Audit Commercial & Technique Boubane

**Entreprise** : {r['comp_name']} ({r['city']})
**Statut Web** : `{r['status']}`
**Site Internet** : {r['url'] or 'Aucun site internet détecté'}
**Technologies** : {', '.join(r['tech']) if r['tech'] else 'N/A'}
**Téléphone** : `{r['phone'] or 'Non renseigné'}` ({r['phone_type']})
**E-mail** : `{r['email'] or 'Non renseigné'}`

---
#### Diagnostic :
{r['audit_comment']}

---
#### Message SMS / WhatsApp prêt à l'envoi :
```text
{r['sms_pitch']}
```

---
#### E-mail de prospection (Charte Humanizer) :
```text
{r['email_pitch']}
```
"""
        clean_markdown = markdown_body.replace("'", "''")
        clean_title = title.replace("'", "''")
        
        # Insert note
        sql_lines.append(f"""
INSERT INTO workspace_4afa97ewunu3hydfohpozj1e3.note (
    id, "createdAt", "updatedAt", title, "bodyV2Markdown", "bodyV2Blocknote"
) VALUES (
    '{note_id}', NOW(), NOW(), '{clean_title}', '{clean_markdown}', NULL
);
""")
        # Link note to company
        sql_lines.append(f"""
INSERT INTO workspace_4afa97ewunu3hydfohpozj1e3."noteTarget" (
    id, "createdAt", "updatedAt", "noteId", "targetCompanyId"
) VALUES (
    '{target_comp_id}', NOW(), NOW(), '{note_id}', '{r['comp_id']}'
);
""")
        # Link note to opportunity
        sql_lines.append(f"""
INSERT INTO workspace_4afa97ewunu3hydfohpozj1e3."noteTarget" (
    id, "createdAt", "updatedAt", "noteId", "targetOpportunityId"
) VALUES (
    '{target_opp_id}', NOW(), NOW(), '{note_id}', '{r['opp_id']}'
);
""")
        
    sql_lines.append("COMMIT;")
    
    sql_path = "scratch/sync_twenty_audit.sql"
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines))
    print(f"Script SQL généré : {sql_path} ({len(sql_lines)} instructions)")
    
    # Execute SQL on VPS
    print("Application des mises à jour sur le conteneur PostgreSQL du VPS...")
    # scp SQL file to VPS
    scp_cmd = ["scp", sql_path, f"{VPS_HOST}:/home/leo/sync_twenty_audit.sql"]
    subprocess.run(scp_cmd, check=True)
    
    # Run psql via docker exec
    run_sql_cmd = SSH_CMD + [
        "docker cp /home/leo/sync_twenty_audit.sql twenty-db-1:/tmp/sync_twenty_audit.sql && "
        "docker exec twenty-db-1 psql -U postgres -d default -f /tmp/sync_twenty_audit.sql && "
        "rm -f /home/leo/sync_twenty_audit.sql"
    ]
    res = subprocess.run(run_sql_cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print("✅ Synchronisation Twenty CRM terminée avec succès sur le VPS !")
    else:
        print(f"❌ Erreur lors de l'exécution SQL : {res.stderr}")

if __name__ == "__main__":
    main()
