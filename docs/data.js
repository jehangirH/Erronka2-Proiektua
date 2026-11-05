/*
 * Erronka 2 — 1. atala (2.1) · Planifikazioaren datuak
 * -----------------------------------------------------
 * Orria eguneratzeko, fitxategi hau bakarrik aldatu behar da.
 * egoera: "eginda" | "egiten" | "egiteke"
 * data formatua: "UUUU-HH-EE"
 */
window.PLAN = {
  proiektua: "Erronka 2 — Egiturak indartzen",
  enpresa: "Zubizarreta gailetak",
  atala: "1. atala (2.1)",
  hasiera: "2026-10-23",
  amaiera: "2026-11-13",
  eguneratua: "2026-11-05",
  taldea: ["Jehangir", "Uday", "Amaia", "Ayub"],

  moduluak: [
    { id: "PLAN", izena: "Plangintza eta antolaketa", kolorea: "#64748b",
      azalpena: "Proiektuaren abiapuntua: enpresaren egoera aztertu, proposamena aurkeztu eta lana kideen artean banatu." },
    { id: "SSG", izena: "Sareak eta sistemak gotortzea", kolorea: "#2563eb",
      azalpena: "Azpiegituraren bizkarrezurra: sarearen segmentazioa, suebakia, sarbide-kontrola, VPNa, babeskopiak eta honeypot-a." },
    { id: "ESJ", izena: "Webgunearen zuzenketa eta dokumentazioa", kolorea: "#0891b2",
      azalpena: "Enpresaren webgunea berrikusi, akatsak eta segurtasun-arazoak zuzendu, eta aldaketak dokumentatu." },
    { id: "OF", izena: "Programazioa — Python automatizazioa", kolorea: "#7c3aed",
      azalpena: "Datu-basearen gaineko automatizazioa: erabiltzaileak detektatu, emailez abisatu eta exekuzioa erregistratu." },
    { id: "HE", izena: "Hacking etikoa", kolorea: "#dc2626",
      azalpena: "Baimendutako auditoria osoa: informazio-bilketa, eskaneatzea, ahultasun-analisia, ustiapena eta txostena." },
    { id: "AAI", izena: "Auzitegi-analisi informatikoa", kolorea: "#ea580c",
      azalpena: "Gorabehera baten ikerketa forentsea: zaintza-katea, ebidentzien bilketa segurua eta analisia." },
    { id: "ZAA", izena: "Zibersegurtasunaren arloko araudia", kolorea: "#0d9488",
      azalpena: "Enpresari aplikatzen zaion lege- eta arau-esparrua eta datuak babesteko neurriak." },
    { id: "ZG", izena: "Zibersegurtasun-gorabeherak eta SGSI", kolorea: "#ca8a04",
      azalpena: "Arriskuen kudeaketa, SGSIa, gorabeherei erantzuteko plana eta komunikazio-plana." },
    { id: "AURK", izena: "Aurkezpena", kolorea: "#0f172a",
      azalpena: "1. atalaren amaierako entrega eta aurkezpena." }
  ],

  atazak: [
    { m: "PLAN", izena: "Proposamena prestatu eta aurkeztu", hasi: "2026-10-23", buka: "2026-10-23", h: 4, kideak: ["Jehangir","Uday","Amaia","Ayub"], egoera: "eginda",
      azalpena: "Zubizarreta gailetak enpresaren egoera aztertu eta segurtasun-proposamena prestatu eta aurkeztu." },
    { m: "PLAN", izena: "1. atalaren plangintza zehaztu eta lan-ildoak banatu", hasi: "2026-10-24", buka: "2026-10-24", h: 2, kideak: ["Jehangir","Uday","Amaia","Ayub"], egoera: "eginda",
      azalpena: "Atazak, epeak eta arduradunak finkatu, eta lan-ildoak kideen artean banatu." },

    { m: "SSG", izena: "Sare-eskema diseinatu: VLANak, azpisareak (VLSM), DMZ eta helbideratzea", hasi: "2026-10-27", buka: "2026-10-28", h: 5, kideak: ["Uday","Ayub"], egoera: "egiten",
      azalpena: "Sarearen topologia logikoa definitu: VLANak, VLSM bidezko azpisareak, DMZ eremua eta IP helbideratze-plana." },
    { m: "SSG", izena: "Suebaki perimetrala (pfSense) instalatu eta iragazki-arauak (default deny) konfiguratu", hasi: "2026-10-28", buka: "2026-10-30", h: 6, kideak: ["Uday","Ayub"], egoera: "eginda",
      azalpena: "pfSense perimetroko suebaki gisa jarri; dena ukatzen duen politika lehenetsia eta beharrezko trafikoa soilik baimentzen duten arauak." },
    { m: "SSG", izena: "VLANak, ACLak eta port-security switch-etan konfiguratu", hasi: "2026-10-30", buka: "2026-11-03", h: 5, kideak: ["Uday","Ayub"], egoera: "eginda",
      azalpena: "Switch-etan VLANak sortu, sarbide-kontroleko zerrendak (ACL) aplikatu eta port-security bidez baimendu gabeko gailuak blokeatu." },
    { m: "SSG", izena: "Active Directory domeinua, GPOak eta 802.1X/RADIUS + MFA ezarri", hasi: "2026-11-03", buka: "2026-11-05", h: 6, kideak: ["Uday","Ayub"], egoera: "egiten",
      azalpena: "Domeinua muntatu, segurtasun-politikak GPO bidez zabaldu eta sarbidea 802.1X/RADIUS eta faktore anitzeko autentifikazioarekin babestu." },
    { m: "SSG", izena: "Egoitza nagusia eta U1 arteko VPN-a konfiguratu", hasi: "2026-11-05", buka: "2026-11-06", h: 3, kideak: ["Uday"], egoera: "egiten",
      azalpena: "Bi kokapenen artean site-to-site tunel zifratua konfiguratu." },
    { m: "SSG", izena: "3-2-1 babeskopiak eta zerbitzari zaharra babeskopia-biltegi gisa gotortu", hasi: "2026-11-06", buka: "2026-11-07", h: 3, kideak: ["Uday"], egoera: "eginda",
      azalpena: "3-2-1 estrategia ezarri (3 kopia, 2 euskarri, 1 kanpoan) eta zerbitzari zaharra babeskopia-biltegi gotortu gisa berrerabili." },
    { m: "SSG", izena: "Honeynet/honeypot (T-Pot) jarri eta probatu", hasi: "2026-11-10", buka: "2026-11-11", h: 2, kideak: ["Uday"], egoera: "egiteke",
      azalpena: "T-Pot plataforma hedatu erasotzaileen jarduera erakartzeko, detektatzeko eta aztertzeko." },

    { m: "ESJ", izena: "Webgunean erroreak bilatu, konpondu eta dokumentatu", hasi: "2026-10-24", buka: "2026-10-30", h: 6, kideak: ["Jehangir","Amaia"], egoera: "eginda",
      azalpena: "Enpresaren webgunea berrikusi, akatsak eta segurtasun-arazoak zuzendu, eta aldaketa guztiak dokumentatu." },

    { m: "OF", izena: "Python script-a: irudirik gabeko erabiltzaileak bilatu datu-basean (SELECT)", hasi: "2026-11-04", buka: "2026-11-05", h: 3, kideak: ["Jehangir"], egoera: "eginda",
      azalpena: "Datu-basera konektatu eta profil-irudirik ez duten erabiltzaileak SELECT kontsulta bidez identifikatu." },
    { m: "OF", izena: "Emaila bidaltzeko automatizazioa (smtplib + STARTTLS) eta bidalketen erregistroa", hasi: "2026-11-05", buka: "2026-11-06", h: 3, kideak: ["Jehangir"], egoera: "eginda",
      azalpena: "Erabiltzaile horiei abisua modu seguruan bidali (STARTTLS) eta bidalketa bakoitza erregistroan gorde." },
    { m: "OF", izena: "Errore-kudeaketa (try/except) eta logging gehitu", hasi: "2026-11-06", buka: "2026-11-06", h: 2, kideak: ["Jehangir"], egoera: "eginda",
      azalpena: "Salbuespenak kudeatu script-a ez dadin eten, eta exekuzioaren gertaerak log fitxategian jaso." },

    { m: "HE", izena: "Auditoria-plana eta idatzizko baimena prestatu", hasi: "2026-11-05", buka: "2026-11-05", h: 2, kideak: ["Jehangir","Amaia"], egoera: "egiteke",
      azalpena: "Auditoriaren irismena, mugak eta metodologia definitu, eta bezeroaren idatzizko baimena prestatu." },
    { m: "HE", izena: "Informazio-bilketa (OSINT, Shodan) eta eskaneatzea (Nmap)", hasi: "2026-11-06", buka: "2026-11-06", h: 3, kideak: ["Amaia"], egoera: "egiteke",
      azalpena: "Iturri irekietatik informazioa bildu eta zerbitzu eta ataka irekiak Nmap bidez eskaneatu." },
    { m: "HE", izena: "Ahultasun-analisia (Nessus)", hasi: "2026-11-06", buka: "2026-11-07", h: 3, kideak: ["Jehangir"], egoera: "egiteke",
      azalpena: "Sistema eta zerbitzuetako ahultasun ezagunak Nessus bidez detektatu eta larritasunaren arabera sailkatu." },
    { m: "HE", izena: "Ustiapena proba-ingurunean (Metasploit)", hasi: "2026-11-09", buka: "2026-11-10", h: 4, kideak: ["Amaia"], egoera: "egiteke",
      azalpena: "Aurkitutako ahultasunak ingurune isolatuan ustiatu, benetako eragina egiaztatzeko." },
    { m: "HE", izena: "Web auditoria egin (Burp Suite)", hasi: "2026-11-10", buka: "2026-11-11", h: 3, kideak: ["Jehangir"], egoera: "egiteke",
      azalpena: "Webgunea Burp Suite bidez aztertu: injekzioak, saio-kudeaketa eta OWASP Top 10eko ahultasunak." },
    { m: "HE", izena: "Ahultasun-txostena idatzi (CVSS) eta konponbideak gehitu", hasi: "2026-11-11", buka: "2026-11-12", h: 3, kideak: ["Jehangir","Amaia"], egoera: "egiteke",
      azalpena: "Aurkikuntza bakoitza CVSS bidez puntuatu eta zuzenketa-neurriak proposatu." },

    { m: "AAI", izena: "Erantzun-prozedura eta zaintza-katea (Chain of Custody) definitu", hasi: "2026-11-05", buka: "2026-11-06", h: 2, kideak: ["Amaia","Ayub"], egoera: "egiteke",
      azalpena: "Gorabehera baten aurreko urratsak eta ebidentzien zaintza-katea (nork, noiz eta nola) definitu." },
    { m: "AAI", izena: "Ebidentziak bildu modu seguruan (RAM, SHA-256 hash-ak)", hasi: "2026-11-09", buka: "2026-11-10", h: 3, kideak: ["Ayub"], egoera: "egiteke",
      azalpena: "RAM memoriaren eta diskoaren irudiak eskuratu eta osotasuna SHA-256 hash-ekin bermatu." },
    { m: "AAI", izena: "Analisia egin (Volatility) eta sare-kaptura (Wireshark)", hasi: "2026-11-10", buka: "2026-11-11", h: 3, kideak: ["Amaia"], egoera: "egiteke",
      azalpena: "Memoria-irudia Volatility-rekin aztertu eta sare-trafikoa Wireshark-ekin ikertu." },
    { m: "AAI", izena: "CherryTree", hasi: "2026-11-11", buka: "2026-11-12", h: 2, kideak: ["Amaia"], egoera: "egiteke",
      azalpena: "Ikerketa forentsearen oharrak eta aurkikuntzak CherryTree-n antolatu eta dokumentatu." },

    { m: "ZAA", izena: "Araudi aplikagarriak aztertu (RGPD, LOPDGDD, ISO 27001, IEC 62443)", hasi: "2026-10-28", buka: "2026-10-30", h: 3, kideak: ["Jehangir","Uday","Amaia","Ayub"], egoera: "eginda",
      azalpena: "Enpresari aplikatzen zaion araudia aztertu: datuen babesa, ISO/IEC 27001 eta industria-sistemetarako IEC 62443." },
    { m: "ZAA", izena: "Datuak babesteko neurriak eta DPO rola zehaztu", hasi: "2026-11-03", buka: "2026-11-04", h: 2, kideak: ["Amaia"], egoera: "eginda",
      azalpena: "Neurri tekniko eta antolakuntzakoak eta Datuak Babesteko Ordezkariaren (DPO) eginkizunak zehaztu." },

    { m: "ZG", izena: "Arrisku-kudeaketa: aktiboak, mehatxuak eta arriskuen balorazioa (probabilitatea x eragina)", hasi: "2026-10-29", buka: "2026-10-31", h: 4, kideak: ["Uday","Amaia","Ayub"], egoera: "eginda",
      azalpena: "Aktiboak identifikatu, mehatxuak aztertu eta arriskua probabilitatea × eragina erabiliz baloratu." },
    { m: "ZG", izena: "SGSI eta gorabeheren erantzun-plana (NIST zikloa) antolatu", hasi: "2026-11-03", buka: "2026-11-05", h: 3, kideak: ["Uday","Amaia"], egoera: "eginda",
      azalpena: "SGSIa antolatu eta gorabeherei erantzuteko plana NIST zikloan oinarritu: prestatu, detektatu, euste, berreskuratu eta ikasi." },
    { m: "ZG", izena: "Komunikazio-plana osatu (barne/kanpo, AEPD 72 ordu)", hasi: "2026-11-05", buka: "2026-11-06", h: 2, kideak: ["Amaia","Ayub"], egoera: "eginda",
      azalpena: "Barne- eta kanpo-komunikazioa definitu, AEPDri 72 orduko epean jakinarazteko prozedura barne." },

    { m: "AURK", izena: "ERRONKA 2 — 1. ATALA AURKEZTU", hasi: "2026-11-13", buka: "2026-11-13", h: 3, kideak: ["Jehangir","Uday","Amaia","Ayub"], egoera: "egiteke", mugarria: true,
      azalpena: "1. ataleko emaitza guztiak bildu, entregatu eta taldean aurkeztu." }
  ]
};
