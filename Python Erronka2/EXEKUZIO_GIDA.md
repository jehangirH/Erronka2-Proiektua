# Exekuzio gida: irudirik gabeko erabiltzaileei maila bidali

Proiektu honek `bdweb` datu basean profileko irudirik ez duten erabiltzaileak bilatzen ditu, eta bakoitzari maila bat bidaltzen dio irudia derrigorrezkoa dela eta login-a egin eta igotzeko esanez. Dena Python-ekin egiten da, eta prozesua astero exekutatzen da automatikoki.

## Fitxategiak

| Fitxategia | Zertarako |
|---|---|
| `bdweb.sql` | Datu basearen dump-a (`produktuak` eta `users` taulak) |
| `docker-compose.yml` | Bi kontenedore: **smtp4dev** (posta zerbitzaria) eta **MariaDB** (`bdweb` datu basea) |
| `erronka2.ipynb` | JupyterLab notebook-a: 4 gelaxka (azalpena + kodea, bi aldiz) |
| `exekutatu.py` | Notebook-a exekutatzen du eta emaitza `exekuzioak/` karpetan gordetzen du |
| `programatu_zeregina.py` | Windows Task Scheduler-en asteroko zeregina sortu, exekutatu, ikusi eta ezabatu |
| `exekuzioak/` | Exekuzio bakoitzaren emaitza (notebook-a irteerekin) eta `log.txt` |

## Aurrebaldintzak

- **Docker Desktop** instalatuta eta martxan.
- **Python 3** eta liburutegi hauek:

```
pip install jupyterlab mysql-connector-python nbclient nbformat
```

## 1. urratsa: kontenedoreak martxan jarri

Proiektuaren karpetan:

```
docker compose up -d
```

Honek bi kontenedore sortzen ditu:

| Kontenedorea | Zerbitzua | Helbidea |
|---|---|---|
| `smtp4dev` | Posta zerbitzaria (web interfazea) | http://localhost:5000 |
| `smtp4dev` | SMTP | `localhost:2525` |
| `bdweb_db` | MariaDB (`root`, pasahitzik gabe) | `127.0.0.1:3307` |

Egiaztatu biak martxan daudela:

```
docker ps
```

Lehen aldian MariaDB-k `bdweb.sql` automatikoki kargatzen du. Itxaron 10-15 segundo hurrengo urratsera pasatu aurretik.

## 2. urratsa: notebook-a exekutatu

### A aukera: JupyterLab-en (eskuz)

```
python -m jupyterlab
```

1. Ireki `erronka2.ipynb`.
2. Menuan: **Run → Run All Cells**.
3. 2. gelaxkak irudirik gabeko erabiltzaileen zerrenda erakusten du.
4. 4. gelaxkak bidalitako mailak erakusten ditu.

### B aukera: Python script-arekin

```
python exekutatu.py
```

Espero den irteera:

```
Irudirik gabeko erabiltzaileak: 1
 - 2: izaskun ffff <izaskun@uni.eus> (irudia: 'usuario.jpg')
Maila bidalita: izaskun@uni.eus
Guztira 1 maila bidali dira.
Emaitza gordeta: ...\exekuzioak\erronka2_2026-10-27_09-44-36.ipynb
```

`exekutatu.py`-k:

- notebook-aren gelaxka guztiak exekutatzen ditu (`nbclient`);
- emaitza fitxategi berri batean gordetzen du `exekuzioak/` karpetan, data eta orduarekin;
- lerro bat idazten du `exekuzioak/log.txt`-n: "Ondo exekutatuta" edo errorea, osorik.

## 3. urratsa: maila iritsi dela egiaztatu

Ireki http://localhost:5000 nabigatzailean. Hor agertu behar da maila hau:

- **Nork:** `admin@bdweb`
- **Nori:** `izaskun@uni.eus`
- **Gaia:** *Profileko irudia igo behar duzu*

## 4. urratsa: asteroko zeregina programatu

Aukeratutako metodoa: **Windows-eko Task Scheduler**, Python-etik kudeatuta (`programatu_zeregina.py`).

```
python programatu_zeregina.py              # zeregina sortu
python programatu_zeregina.py exekutatu    # orain bertan exekutatu (proba egiteko)
python programatu_zeregina.py egoera       # egoera, azken exekuzioa eta hurrengoa ikusi
python programatu_zeregina.py ezabatu      # zeregina ezabatu
```

Sortutako zereginak **"Erronka2 - Irudirik gabeko erabiltzaileak"** izena du, eta:

- astelehenero 09:00etan exekutatzen du `exekutatu.py`;
- ordenagailua orduan itzalita bazegoen, piztean exekutatzen da;
- eramangarria bateriarekin badago ere exekutatzen da;
- proiektuaren karpetatik exekutatzen da.

Zeregina XML definizio batekin sortzen da (`schtasks /Create /XML`). Arrazoia: `schtasks`-en aukera arruntekin ezin da "bateriarekin ere exekutatu" aukeratu, eta lehenetsita Windows-ek ez ditu zereginak abiarazten bateriarekin.

Egiaztatzeko:

1. `python programatu_zeregina.py exekutatu`
2. Segundo batzuk itxaron.
3. Begiratu `exekuzioak/log.txt` eta http://localhost:5000.

Grafikoki ere ikus daiteke: **Task Scheduler** (`taskschd.msc`) → *Task Scheduler Library*.

> **Garrantzitsua:** zeregina exekutatzean kontenedoreek martxan egon behar dute. `restart: unless-stopped` dutenez, Docker Desktop abiaraztean bakarrik pizten dira.

## Irizpidea: "irudirik gabe"

Erabiltzaile batek irudirik ez duela kontsideratzen da `irudia` eremua hau denean:

- `NULL`, edo
- hutsik, edo
- irudi lehenetsia: `usuario.jpg`.

Irizpidea aldatzeko, 2. gelaxkako `WHERE` klausula edo `IRUDI_LEHENETSIA` aldagaia aldatu.

## Arazoak konpontzen

| Arazoa | Konponbidea |
|---|---|
| `Can't connect to MySQL server on '127.0.0.1:3307'` | Egiaztatu `bdweb_db` martxan dagoela (`docker ps`) eta itxaron segundo batzuk |
| `ConnectionRefusedError` maila bidaltzean | Egiaztatu `smtp4dev` martxan dagoela eta 2525 portua libre dagoela |
| Zeregina `Queued` egoeran geratzen da eta ez da exekutatzen | Zeregina `schtasks`-ekin eskuz sortu da (bateria murrizketarekin). Sortu berriro `python programatu_zeregina.py`-rekin |
| Zeregina exekutatu da baina ez da mailik iritsi | Begiratu `exekuzioak/log.txt`: errore osoa hor dago |
| 3306 portua okupatuta | Horregatik erabiltzen da 3307. XAMPP-eko MySQL erabili nahi baduzu, aldatu `DB_CONFIG`-eko `port` 2. gelaxkan |
| `bdweb.sql`-ko aldaketak ez dira kargatzen | Dump-a lehen aldian bakarrik kargatzen da. Datu basea berrabiarazteko: `docker compose down -v` eta gero `docker compose up -d` |

## Dena gelditu

```
python programatu_zeregina.py ezabatu   # asteroko zeregina ezabatu
docker compose down                     # kontenedoreak gelditu (datuak mantentzen dira)
docker compose down -v                  # kontenedoreak eta datuak ezabatu
```
