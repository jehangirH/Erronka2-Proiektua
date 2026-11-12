// Erronka 2 · Planifikazioaren datuak
// Orria eguneratzeko, fitxategi hau bakarrik aldatu behar da.
// egoera: "eginda" | "egiten" | "egiteke"   ·   datak: "UUUU-HH-EE"
// Iturria: Zubizarreta_Erronka2_Planifikazioa_v4.xlsx
window.PLAN = {
 "proiektua": "Erronka 2 — Egiturak indartzen",
 "enpresa": "Zubizarreta gailetak",
 "ikastaroa": "Zibersegurtasuneko espezializazio-ikastaroa · UNI Eibar-Ermua",
 "eguneratua": "2026-11-12",
 "iturria": "Zubizarreta_Erronka2_Planifikazioa_v4.xlsx",
 "taldea": ["Jehangir", "Uday", "Amaia", "Ayub"],
 "moduluak": {
  "PLAN": "Plangintza eta antolaketa",
  "SSG": "Sareak eta sistemak gotortzea",
  "ESJ": "Ekoizpen seguruan jartzea",
  "OF": "Programazioa (Python)",
  "HE": "Hacking etikoa",
  "AAI": "Auzitegi-analisi informatikoa",
  "ZAA": "Zibersegurtasunaren arloko araudia",
  "ZG/SGSI": "Zibersegurtasun-gorabeherak eta SGSI",
  "AURK": "Entrega eta aurkezpena"
 },
 "atalak": [
  {
   "id": "2.1",
   "izena": "1. atala",
   "azpititulua": "Gotortzea, auditoria eta araudia",
   "helburua": "Enpresaren sarea eta sistemak gotortu, segurtasuna auditatu (hacking etikoa eta auzitegi-analisia), araudia aztertu eta SGSIa eta gorabeheren erantzun-plana antolatu.",
   "hasiera": "2026-10-23",
   "amaiera": "2026-11-13",
   "blokeak": [
    {
     "kodea": "PLAN",
     "izenburua": "Plangintza eta antolaketa",
     "atazak": [
      {"izena": "Proposamena prestatu eta aurkeztu", "hasi": "2026-10-23", "buka": "2026-10-23", "h": 4, "kideak": [ "Jehangir", "Uday", "Amaia", "Ayub" ], "egoera": "eginda", "azalpena": "Enpresaren egoera aztertu eta segurtasun-proposamena prestatu eta aurkeztu."},
      {"izena": "1. atalaren plangintza zehaztu eta lan-ildoak banatu", "hasi": "2026-10-24", "buka": "2026-10-24", "h": 2, "kideak": [ "Jehangir", "Uday", "Amaia", "Ayub" ], "egoera": "eginda", "azalpena": "Atazak, epeak eta arduradunak finkatu, eta lan-ildoak kideen artean banatu."}
     ]
    },
    {
     "kodea": "SSG",
     "izenburua": "Sareak eta sistemak gotortzea",
     "atazak": [
      {"izena": "Sare-eskema diseinatu: VLANak, azpisareak (VLSM), DMZ eta helbideratzea", "hasi": "2026-10-27", "buka": "2026-10-28", "h": 5, "kideak": [ "Uday", "Ayub" ], "egoera": "egiten", "azalpena": "Sarearen topologia logikoa definitu: VLANak, VLSM bidezko azpisareak, DMZ eremua eta IP helbideratze-plana."},
      {"izena": "Suebaki perimetrala (pfSense) instalatu eta iragazki-arauak (default deny) konfiguratu", "hasi": "2026-10-28", "buka": "2026-10-30", "h": 6, "kideak": [ "Uday", "Ayub" ], "egoera": "eginda", "azalpena": "pfSense perimetroko suebaki gisa jarri: dena ukatzen duen politika lehenetsia eta beharrezko trafikoa soilik baimentzen duten arauak."},
      {"izena": "VLANak, ACLak eta port-security switch-etan konfiguratu", "hasi": "2026-10-30", "buka": "2026-11-03", "h": 5, "kideak": [ "Uday", "Ayub" ], "egoera": "eginda", "azalpena": "Switch-etan VLANak sortu, ACLak aplikatu eta port-security bidez baimendu gabeko gailuak blokeatu."},
      {"izena": "Active Directory domeinua, GPOak eta 802.1X/RADIUS + MFA ezarri", "hasi": "2026-11-03", "buka": "2026-11-05", "h": 6, "kideak": [ "Uday", "Ayub" ], "egoera": "egiten", "azalpena": "Domeinua muntatu, segurtasun-politikak GPO bidez zabaldu eta sarbidea 802.1X/RADIUS eta MFA bidez babestu."},
      {"izena": "Egoitza nagusia eta U1 arteko VPN-a konfiguratu", "hasi": "2026-11-05", "buka": "2026-11-06", "h": 3, "kideak": [ "Uday" ], "egoera": "egiten", "azalpena": "Bi kokapenen artean site-to-site tunel zifratua konfiguratu."},
      {"izena": "3-2-1 babeskopiak eta zerbitzari zaharra babeskopia-biltegi gisa gotortu", "hasi": "2026-11-06", "buka": "2026-11-07", "h": 3, "kideak": [ "Uday" ], "egoera": "eginda", "azalpena": "3-2-1 estrategia ezarri (3 kopia, 2 euskarri, 1 kanpoan) eta zerbitzari zaharra babeskopia-biltegi gotortu gisa berrerabili."}
     ]
    },
    {
     "kodea": "ESJ",
     "izenburua": "Webgunearen zuzenketa eta dokumentazioa",
     "atazak": [
      {"izena": "Webgunean erroreak bilatu, konpondu eta dokumentatu", "hasi": "2026-10-24", "buka": "2026-10-30", "h": 6, "kideak": [ "Jehangir", "Amaia" ], "egoera": "eginda", "azalpena": "Enpresaren webgunea berrikusi, akatsak eta segurtasun-arazoak zuzendu, eta aldaketak dokumentatu."}
     ]
    },
    {
     "kodea": "OF",
     "izenburua": "Programazioa — Python automatizazioa",
     "atazak": [
      {"izena": "Python script-a: irudirik gabeko erabiltzaileak bilatu datu-basean (SELECT)", "hasi": "2026-11-04", "buka": "2026-11-05", "h": 3, "kideak": [ "Jehangir" ], "egoera": "eginda", "azalpena": "Datu-basera konektatu eta profil-irudirik ez duten erabiltzaileak SELECT kontsulta bidez identifikatu."},
      {"izena": "Emaila bidaltzeko automatizazioa (smtplib + STARTTLS) eta bidalketen erregistroa", "hasi": "2026-11-05", "buka": "2026-11-06", "h": 3, "kideak": [ "Jehangir" ], "egoera": "eginda", "azalpena": "Erabiltzaile horiei abisua modu seguruan (STARTTLS) bidali eta bidalketa bakoitza erregistroan gorde."},
      {"izena": "Errore-kudeaketa (try/except) eta logging gehitu", "hasi": "2026-11-06", "buka": "2026-11-06", "h": 2, "kideak": [ "Jehangir" ], "egoera": "eginda", "azalpena": "Salbuespenak kudeatu script-a eten ez dadin, eta exekuzioaren gertaerak log fitxategian jaso."}
     ]
    },
    {
     "kodea": "HE",
     "izenburua": "Hacking etikoa",
     "atazak": [
      {"izena": "Auditoria-plana eta idatzizko baimena prestatu", "hasi": "2026-11-05", "buka": "2026-11-05", "h": 2, "kideak": [ "Jehangir", "Amaia" ], "egoera": "eginda", "azalpena": "Auditoriaren irismena, mugak eta metodologia definitu, eta bezeroaren idatzizko baimena prestatu."},
      {"izena": "Zerbitzuen azterketa (Nmap, WhatWeb eta Gobuster)", "hasi": "2026-11-06", "buka": "2026-11-06", "h": 3, "kideak": [ "Amaia" ], "egoera": "eginda", "azalpena": "Ataka eta zerbitzu irekiak Nmap bidez identifikatu, web-teknologiak WhatWeb-ekin detektatu eta direktorio ezkutuak Gobuster-ekin bilatu."},
      {"izena": "Web zerbitzariaren eta aplikazioaren konfigurazioaren azterketa (HTTP, HTTPS, segurtasun-goiburuak eta cookieak)", "hasi": "2026-11-06", "buka": "2026-11-07", "h": 3, "kideak": [ "Jehangir" ], "egoera": "eginda", "azalpena": "HTTP/HTTPS konfigurazioa, segurtasun-goiburuak eta cookieen atributuak (Secure, HttpOnly, SameSite) egiaztatu."},
      {"izena": "Web aplikazioaren segurtasun-probak egitea (SQL Injection, XSS, autentifikazioa eta saioen kudeaketa)", "hasi": "2026-11-09", "buka": "2026-11-10", "h": 4, "kideak": [ "Jehangir" ], "egoera": "eginda", "azalpena": "SQL injekzioa, XSS, autentifikazioa eta saioen kudeaketa probatu proba-ingurunean."},
      {"izena": "Emaitzak aztertzea eta dokumentatzea", "hasi": "2026-11-11", "buka": "2026-11-12", "h": 3, "kideak": [ "Jehangir", "Amaia" ], "egoera": "eginda", "azalpena": "Aurkikuntzak larritasunaren arabera sailkatu eta zuzenketa-neurriekin batera txostenean dokumentatu."}
     ]
    },
    {
     "kodea": "AAI",
     "izenburua": "Auzitegi-analisi informatikoa",
     "atazak": [
      {"izena": "Zaintza-katea (Chain of Custody): txantiloia definitu", "hasi": "2026-11-05", "buka": "2026-11-06", "h": 2, "kideak": [ "Amaia", "Ayub" ], "egoera": "eginda", "azalpena": "Ebidentzien zaintza-katearen txantiloia definitu: nork, noiz eta nola maneiatzen dituen."},
      {"izena": "Ebidentziak bildu modu seguruan (RAM, SHA-256 hash-ak)", "hasi": "2026-11-09", "buka": "2026-11-10", "h": 3, "kideak": [ "Ayub" ], "egoera": "eginda", "azalpena": "RAM memoriaren irudia eskuratu eta osotasuna SHA-256 hash-ekin bermatu."},
      {"izena": "Analisia egin (Volatility) eta sare-kaptura (Wireshark)", "hasi": "2026-11-10", "buka": "2026-11-11", "h": 3, "kideak": [ "Amaia" ], "egoera": "eginda", "azalpena": "Memoria-irudia Volatility-rekin aztertu eta sare-trafikoa Wireshark-ekin ikertu."},
      {"izena": "Ikerketaren dokumentazioa (CherryTree)", "hasi": "2026-11-11", "buka": "2026-11-12", "h": 2, "kideak": [ "Amaia" ], "egoera": "eginda", "azalpena": "Ikerketa forentsearen oharrak eta aurkikuntzak CherryTree-n antolatu eta dokumentatu."}
     ]
    },
    {
     "kodea": "ZAA",
     "izenburua": "Zibersegurtasunaren arloko araudia",
     "atazak": [
      {"izena": "Araudi aplikagarriak aztertu (RGPD, LOPDGDD, ISO 27001, IEC 62443)", "hasi": "2026-10-28", "buka": "2026-10-30", "h": 3, "kideak": [ "Jehangir", "Uday", "Amaia", "Ayub" ], "egoera": "eginda", "azalpena": "Enpresari aplikatzen zaion araudia aztertu: datuen babesa, ISO/IEC 27001 eta industria-sistemetarako IEC 62443."},
      {"izena": "Datuak babesteko neurriak eta DPO rola zehaztu", "hasi": "2026-11-03", "buka": "2026-11-04", "h": 2, "kideak": [ "Amaia" ], "egoera": "eginda", "azalpena": "Neurri tekniko eta antolakuntzakoak eta Datuak Babesteko Ordezkariaren (DPO) eginkizunak zehaztu."}
     ]
    },
    {
     "kodea": "ZG/SGSI",
     "izenburua": "Zibersegurtasun-gorabeherak eta SGSI",
     "atazak": [
      {"izena": "Arrisku-kudeaketa: aktiboak, mehatxuak eta arriskuen balorazioa (probabilitatea x eragina)", "hasi": "2026-10-29", "buka": "2026-10-31", "h": 4, "kideak": [ "Uday", "Amaia", "Ayub" ], "egoera": "eginda", "azalpena": "Aktiboak identifikatu, mehatxuak aztertu eta arriskua probabilitatea × eragina erabiliz baloratu."},
      {"izena": "SGSI eta gorabeheren erantzun-plana (NIST zikloa) antolatu", "hasi": "2026-11-03", "buka": "2026-11-05", "h": 3, "kideak": [ "Uday", "Amaia" ], "egoera": "eginda", "azalpena": "SGSIa antolatu eta gorabeherei erantzuteko plana NIST zikloan oinarritu."},
      {"izena": "Komunikazio-plana osatu (barne/kanpo, AEPD 72 ordu)", "hasi": "2026-11-05", "buka": "2026-11-06", "h": 2, "kideak": [ "Amaia", "Ayub" ], "egoera": "eginda", "azalpena": "Barne- eta kanpo-komunikazioa definitu, AEPDri 72 orduko epean jakinarazteko prozedura barne."}
     ]
    },
    {
     "kodea": "AURK",
     "izenburua": "Entrega eta aurkezpena",
     "atazak": [
      {"izena": "1. atalaren entrega eta aurkezpena", "hasi": "2026-11-13", "buka": "2026-11-13", "h": 3, "kideak": [ "Jehangir", "Uday", "Amaia", "Ayub" ], "egoera": "egiteke", "azalpena": "1. ataleko emaitza guztiak bildu, entregatu eta taldean aurkeztu.", "mugarria": true}
     ]
    }
   ]
  },
  {
   "id": "2.2",
   "izena": "2. atala",
   "azpititulua": "IT/OT, web segurua eta monitorizazioa",
   "helburua": "Monitorizazioa (SIEM) gehitu, ingurune industriala (OT) segmentatu eta babestu, PHP salerosketa-webgune segurua garatu eta hedatu, eta compliance eredua eta OT gorabeheren kudeaketa landu.",
   "hasiera": "2026-12-03",
   "amaiera": "2026-12-16",
   "blokeak": [
    {
     "kodea": "SSG",
     "izenburua": "Sareak eta sistemak gotortzea",
     "atazak": [
      {"izena": "Wazuh SIEM/HIDS instalatu eta alerta-arauak definitu", "hasi": "2026-12-03", "buka": "2026-12-04", "h": 4, "kideak": [ "Ayub" ], "egoera": "egiteke", "azalpena": "Wazuh hedatu ekipoen gertaerak zentralizatzeko, eta erasoak detektatzeko alerta-arauak definitu."},
      {"izena": "Honeynet/honeypot (T-Pot) jarri eta probatu", "hasi": "2026-12-04", "buka": "2026-12-05", "h": 2, "kideak": [ "Amaia", "Ayub" ], "egoera": "egiteke", "azalpena": "T-Pot plataforma hedatu erasotzaileen jarduera erakartzeko, detektatzeko eta aztertzeko."}
     ]
    },
    {
     "kodea": "SSG",
     "izenburua": "IT/OT integrazioa eta segurtasun industriala",
     "atazak": [
      {"izena": "IDMZ diseinatu eta IT/OT segmentazioa (Purdue eredua) ezarri", "hasi": "2026-12-03", "buka": "2026-12-05", "h": 4, "kideak": [ "Amaia", "Ayub" ], "egoera": "egiteke", "azalpena": "IT eta OT sareen artean IDMZ eremua diseinatu eta segmentazioa Purdue ereduaren mailen arabera ezarri."},
      {"izena": "Ingurune industriala birsortu (OpenPLC + FUXA SCADA)", "hasi": "2026-12-07", "buka": "2026-12-09", "h": 5, "kideak": [ "Amaia", "Ayub" ], "egoera": "egiteke", "azalpena": "Ekoizpen-lerro baten simulazioa sortu: OpenPLC bidezko PLCa eta FUXA bidezko SCADA interfazea."},
      {"izena": "OT honeypot (Conpot) eta Modbus arauak IPS-an konfiguratu", "hasi": "2026-12-09", "buka": "2026-12-10", "h": 3, "kideak": [ "Jehangir", "Ayub" ], "egoera": "egiteke", "azalpena": "Conpot bidez OT honeypot-a jarri eta IPS-an Modbus trafikoa kontrolatzeko arauak konfiguratu."},
      {"izena": "OT mehatxuen txostena idatzi (IEC 62443 zonak eta kanalak)", "hasi": "2026-12-10", "buka": "2026-12-11", "h": 3, "kideak": [ "Amaia" ], "egoera": "egiteke", "azalpena": "OT inguruneko mehatxuak aztertu eta IEC 62443 zonen eta kanalen arabera dokumentatu."}
     ]
    },
    {
     "kodea": "ESJ",
     "izenburua": "Ekoizpen seguruan jartzea — PHP salerosketa-webgunea",
     "atazak": [
      {"izena": "Datu-basearen egitura diseinatu (erabiltzaileak, produktuak, kategoriak, eskaerak, ordainketak)", "hasi": "2026-12-03", "buka": "2026-12-04", "h": 3, "kideak": [ "Jehangir", "Amaia" ], "egoera": "egiteke", "azalpena": "Datu-basearen eredua diseinatu: erabiltzaileak, produktuak, kategoriak, eskaerak eta ordainketak."},
      {"izena": "PHP + MariaDB salerosketa-webgunea garatu (katalogoa, saskia, eskaerak)", "hasi": "2026-12-04", "buka": "2026-12-11", "h": 10, "kideak": [ "Jehangir", "Uday" ], "egoera": "egiteke", "azalpena": "Salerosketa-webgunea garatu: produktu-katalogoa, erosketa-saskia eta eskaeren kudeaketa."},
      {"izena": "Rolak eta baimenak garatu (bezeroa, banatzailea, admin)", "hasi": "2026-12-09", "buka": "2026-12-10", "h": 4, "kideak": [ "Uday" ], "egoera": "egiteke", "azalpena": "Erabiltzaile-rolak (bezeroa, banatzailea, admin) eta bakoitzaren baimenak inplementatu."},
      {"izena": "Segurtasun-kontrolak ezarri: PDO prepared statements, Argon2id, CSRF eta XSS babesa", "hasi": "2026-12-11", "buka": "2026-12-12", "h": 6, "kideak": [ "Jehangir" ], "egoera": "egiteke", "azalpena": "Kontsulta prestatuak (PDO), pasahitzen hash-a Argon2id-ekin eta CSRF eta XSS erasoen aurkako babesa ezarri."},
      {"izena": "GitHub Actions CI/CD workflow-a konfiguratu (PHPStan, PHPUnit, deploy)", "hasi": "2026-12-14", "buka": "2026-12-15", "h": 4, "kideak": [ "Amaia" ], "egoera": "egiteke", "azalpena": "GitHub Actions bidez analisi estatikoa (PHPStan), probak (PHPUnit) eta hedapena automatizatu."}
     ]
    },
    {
     "kodea": "ZAA",
     "izenburua": "Zibersegurtasunaren arloko araudia",
     "atazak": [
      {"izena": "Erantzukizun penaleko eredua definitu (UNE 19601 / ISO 37001)", "hasi": "2026-12-09", "buka": "2026-12-10", "h": 3, "kideak": [ "Uday" ], "egoera": "egiteke", "azalpena": "Erantzukizun penala prebenitzeko eredua (compliance) definitu, UNE 19601 eta ISO 37001 arauetan oinarrituta."}
     ]
    },
    {
     "kodea": "ZG/SGSI",
     "izenburua": "Zibersegurtasun-gorabeherak eta SGSI",
     "atazak": [
      {"izena": "OT gertaera bat simulatu eta ikerketa/zuzenketa dokumentatu", "hasi": "2026-12-11", "buka": "2026-12-12", "h": 3, "kideak": [ "Uday", "Ayub" ], "egoera": "egiteke", "azalpena": "OT inguruneko gorabehera bat simulatu, eta ikerketa eta zuzenketa-urratsak dokumentatu."}
     ]
    },
    {
     "kodea": "AURK",
     "izenburua": "Entrega eta aurkezpena",
     "atazak": [
      {"izena": "2. atalaren entrega eta aurkezpena", "hasi": "2026-12-16", "buka": "2026-12-16", "h": 3, "kideak": [ "Jehangir", "Uday", "Amaia", "Ayub" ], "egoera": "egiteke", "azalpena": "2. ataleko emaitza guztiak bildu, entregatu eta taldean aurkeztu.", "mugarria": true}
     ]
    }
   ]
  }
 ]
};

// ---------- Dokumentuak ----------
// kodea: moduluaren kodea · fitxategia: docs/ karpetarekiko bidea · aurkibidea: dokumentuaren atal nagusiak
window.PLAN.dokumentuak = [
 {"kodea": "ESJ", "izenburua": "Webgunearen segurtasun-auditoria eta zuzenketak (laburpena)", "azalpena": "Webgunean aurkitutako ahuleziak, haien arriskuak eta egindako zuzenketa nagusiak, laburtuta.", "fitxategia": "dokumentuak/ESJ/erronka2_web___Akatsen_txostena_laburtua.docx", "kb": 36, "aurkibidea": ["1. Sarrera", "2. Laburpena", "3. Segurtasun-maila, eraso-bektoreak eta arriskuak (ESJ 4)", "4. Ahulezien zerrenda (ESJ 5)", "5. Zuzenketa nagusiak (ESJ 6)", "6. Web-zerbitzariaren konfigurazioa", "7. Ondorioa"]},
 {"kodea": "OF", "izenburua": "Python automatizazioa — dokumentazioa", "azalpena": "Profileko irudirik ez duten erabiltzaileak datu-basean bilatu eta haiei emaila bidaltzen dien programaren azalpena.", "fitxategia": "dokumentuak/OF/Python_automatizazioa___Dokumentazioa.docx", "kb": 42, "aurkibidea": ["1. Zer egiten du programak?", "2. Osagaiak eta nola lotzen diren", "3. Kodea lerroz lerro", "4. Datu-basea eta irizpidea", "5. Nola exekutatu", "6. Erabaki teknikoak eta zergatik", "7. Mugak eta hobekuntzak", "8. Irakaslearen galdera posibleak eta erantzunak", "9. Arazoak konpontzen"]},
 {"kodea": "HE", "izenburua": "Auditoria-plana eta idatzizko baimena", "azalpena": "Auditoriaren irismena, mugak, faseak, tresnak eta bezeroaren idatzizko baimena.", "fitxategia": "dokumentuak/HE/Auditoria_plana_eta_idatzizko_baimena_Zubizarreta_Gailetak.docx", "kb": 335, "aurkibidea": ["1. Dokumentuaren helburua", "2. Irismena eta mugak", "3. Auditoria-faseak eta lan-plangintza", "4. Erabiliko diren tresnak", "5. Lan-prozedura eta segurtasun-neurriak", "6. Aurreikusitako entregagaiak", "7. Idatzizko baimena"]},
 {"kodea": "HE", "izenburua": "Pentesting txostena", "azalpena": "Web-aplikazioaren aurkako proba ez-suntsitzaileak: enumerazioa, goiburuak, SQLi eta XSS, eta hobekuntza-proposamenak.", "fitxategia": "dokumentuak/HE/Pentesting_txostena_Zubizarreta_Gailetak.docx", "kb": 1716, "aurkibidea": ["1. Laburpena", "2. Irismena eta metodologia", "3. Ingurunearen ezagutza eta enumerazioa", "4. HTTP, HTTPS eta segurtasun-goiburuak", "5. SQL Injection (SQLi)", "6. Cross-Site Scripting (XSS)", "7. Aurkikuntzen laburpena", "8. Hobekuntza-proposamenak", "9. Ondorioa"]},
 {"kodea": "AAI", "izenburua": "Sareko analisi forentsearen txostena", "azalpena": "Web-zerbitzariaren aurkako trafikoaren azterketa: enumerazioa, autentifikazio-saiakerak eta aurkikuntzak.", "fitxategia": "dokumentuak/AAI/Sareko_analisi_forentsearen_txostena.docx", "kb": 597, "aurkibidea": ["1. Laburpena", "2. Metodologia", "3. Analisiaren topologia", "4. Froga-inbentarioa", "5. WAN eta LAN trafikoaren azterketa", "6. HTTP ezagutza eta enumerazioa", "7. Autentifikazio-saiakerak", "8. Ataken azterketak eta suebakia", "10. Aurkikuntzak", "11. Ondorioa"]},
 {"kodea": "AAI", "izenburua": "Froga digitalen zaintza-katea", "azalpena": "Kasuko ebidentzien zaintza-katea beteta: deskribapena, aldaketak, ekintzak eta hash-ak.", "fitxategia": "dokumentuak/AAI/Froga_digitalen_zaintza-katea.docx", "kb": 13, "aurkibidea": ["1. Kasuaren datuak", "2. Frogaren deskribapena", "3. Zaintza-aldaketak (pertsona batetik bestera igarotzea)", "4. Ekintzen erregistroa (ebidentziaren manipulazioak)", "5. Osotasun-egiaztapena (hash-ak)", "6. Oharrak eta behaketak", "7. Itxiera"]},
 {"kodea": "AAI", "izenburua": "Froga digitalen zaintza-katea (txantiloia)", "azalpena": "Zaintza-katea betetzeko txantiloi hutsa.", "fitxategia": "dokumentuak/AAI/Froga_digitalen_zaintza-katea_txantiloia.docx", "kb": 12, "aurkibidea": ["1. Kasuaren datuak", "2. Frogaren deskribapena", "3. Zaintza-aldaketak (pertsona batetik bestera igarotzea)", "4. Ekintzen erregistroa (ebidentziaren manipulazioak)", "5. Osotasun-egiaztapena (hash-ak)", "6. Oharrak eta behaketak", "7. Itxiera"]},
 {"kodea": "ZAA", "izenburua": "Compliance-plana", "azalpena": "ISO 37301en oinarritutako compliance-plana: arauak, arriskuak, neurriak eta erantzukizunak.", "fitxategia": "dokumentuak/ZAA/01_Compliance-plana.docx", "kb": 19, "aurkibidea": ["1. Zer da compliance plana?", "2. Aplikatzen diren arauak", "3. Compliance arriskuak", "4. Neurriak", "5. Delituen eta zergen prebentzioa", "6. Datu-babesa eta zibersegurtasuna compliance-ean", "7. Funtzioak eta erantzukizunak", "8. Kontrola eta hobekuntza", "9. Ondorioa"]},
 {"kodea": "ZAA", "izenburua": "Datu pertsonalen babesa", "azalpena": "RGPD eta LOPDGDD betetzeko printzipioak, tratamenduen erregistroa eta prozedurak.", "fitxategia": "dokumentuak/ZAA/03_Datu_pertsonalen_babesa.docx", "kb": 18, "aurkibidea": ["1. Helburua eta oinarria", "2. RGPDren printzipioak Zubizarretan", "3. Datu-tratamenduen erregistroa", "4. Prozedurak", "5. Zehapenak", "6. Ondorioa"]},
 {"kodea": "ZG/SGSI", "izenburua": "SGSIa eta gorabeheren erantzun-plana", "azalpena": "ISO/IEC 27001 eta ISA/IEC 62443 oinarri hartuta: arriskuak, erantzun-plana eta komunikazio-plana.", "fitxategia": "dokumentuak/ZG-SGSI/02_SGSI.docx", "kb": 32, "aurkibidea": ["1. SGSIa Zubizarretan", "2. Ekoizpen-sarea babesteko: ISA/IEC 62443", "3. Arriskuak eta mehatxuak", "4. Gorabeheren erantzun-plana", "5. Komunikazio-plana", "6. Neurketa, probak eta hobekuntza", "7. Ondorioa"]}
];
