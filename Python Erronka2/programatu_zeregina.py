"""Windows Task Scheduler-en zeregina kudeatzen du, exekutatu.py astero (astelehenetan 09:00etan) exekutatzeko.

Erabilera:
    python programatu_zeregina.py            zeregina sortu
    python programatu_zeregina.py exekutatu  zeregina orain bertan exekutatu (proba egiteko)
    python programatu_zeregina.py egoera     zereginaren egoera eta azken exekuzioa ikusi
    python programatu_zeregina.py ezabatu    zeregina ezabatu
"""
import argparse
import subprocess
import sys
import tempfile
from datetime import datetime, timedelta
from pathlib import Path
from xml.sax.saxutils import escape

ZEREGIN_IZENA = "Erronka2 - Irudirik gabeko erabiltzaileak"
KARPETA = Path(__file__).resolve().parent
SCRIPTA = KARPETA / "exekutatu.py"

# Zereginaren definizioa XML formatuan. "schtasks /Create /SC WEEKLY" erabiliz ezin dira aukera hauek aldatu:
#   - DisallowStartIfOnBatteries/StopIfGoingOnBatteries: eramangarria bateriarekin badago ere exekutatu
#   - StartWhenAvailable: ordenagailua itzalita bazegoen, piztean exekutatu
#   - WorkingDirectory: proiektuaren karpetatik exekutatu
ZEREGIN_XML = """<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>Irudirik gabeko erabiltzaileei maila bidali (astero)</Description>
  </RegistrationInfo>
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>{hasiera}</StartBoundary>
      <ScheduleByWeek>
        <DaysOfWeek><Monday /></DaysOfWeek>
        <WeeksInterval>1</WeeksInterval>
      </ScheduleByWeek>
    </CalendarTrigger>
  </Triggers>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <StartWhenAvailable>true</StartWhenAvailable>
    <ExecutionTimeLimit>PT1H</ExecutionTimeLimit>
  </Settings>
  <Actions>
    <Exec>
      <Command>{python}</Command>
      <Arguments>"{scripta}"</Arguments>
      <WorkingDirectory>{karpeta}</WorkingDirectory>
    </Exec>
  </Actions>
</Task>
"""


def schtasks(*argumentuak):
    subprocess.run(["schtasks", *argumentuak], check=True)


def hurrengo_astelehena():
    # Hasiera data etorkizunean jarri; bestela StartWhenAvailable-k pasatako astelehena exekutatuko luke sortzean
    orain = datetime.now()
    hurrengoa = (orain + timedelta(days=-orain.weekday() % 7)).replace(hour=9, minute=0, second=0, microsecond=0)
    if hurrengoa <= orain:
        hurrengoa += timedelta(days=7)
    return hurrengoa


def sortu():
    # Python bera (sys.executable) erabiltzen da, liburutegi berdinekin exekutatzeko
    xml = ZEREGIN_XML.format(hasiera=hurrengo_astelehena().isoformat(), python=escape(sys.executable),
                             scripta=escape(str(SCRIPTA)), karpeta=escape(str(KARPETA)))
    with tempfile.TemporaryDirectory() as tmp:
        xml_fitxategia = Path(tmp) / "zeregina.xml"
        xml_fitxategia.write_text(xml, encoding="utf-16")
        schtasks("/Create", "/TN", ZEREGIN_IZENA, "/XML", str(xml_fitxategia), "/F")


def main():
    parser = argparse.ArgumentParser(description="Asteroko zeregina kudeatu")
    parser.add_argument("ekintza", nargs="?", default="sortu",
                        choices=["sortu", "exekutatu", "egoera", "ezabatu"])
    ekintza = parser.parse_args().ekintza

    if ekintza == "sortu":
        sortu()
    elif ekintza == "exekutatu":
        schtasks("/Run", "/TN", ZEREGIN_IZENA)
    elif ekintza == "egoera":
        schtasks("/Query", "/TN", ZEREGIN_IZENA, "/V", "/FO", "LIST")
    elif ekintza == "ezabatu":
        schtasks("/Delete", "/TN", ZEREGIN_IZENA, "/F")


if __name__ == "__main__":
    main()
