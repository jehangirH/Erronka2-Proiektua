"""erronka2.ipynb notebook-a exekutatzen du eta emaitza exekuzioak/ karpetan gordetzen du.

Erabilera:  python exekutatu.py
"""
import traceback
from datetime import datetime
from pathlib import Path

import nbformat
from nbclient import NotebookClient

KARPETA = Path(__file__).resolve().parent
NOTEBOOK = KARPETA / "erronka2.ipynb"
IRTEERA = KARPETA / "exekuzioak"
LOGA = IRTEERA / "log.txt"


def idatzi_loga(testua):
    # Zeregin automatikoak ez du kontsolarik: emaitza eta erroreak log fitxategian gordetzen dira
    IRTEERA.mkdir(exist_ok=True)
    with open(LOGA, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {testua}\n")


def exekutatu():
    nb = nbformat.read(NOTEBOOK, as_version=4)

    # Gelaxka guztiak exekutatu, proiektuaren karpetatik (zereginak beste karpeta batetik abiarazten du)
    bezeroa = NotebookClient(nb, timeout=120, kernel_name="python3",
                             resources={"metadata": {"path": str(KARPETA)}})
    bezeroa.execute()

    # Exekuzio bakoitza fitxategi berri batean gorde, data eta orduarekin
    IRTEERA.mkdir(exist_ok=True)
    fitxategia = IRTEERA / f"erronka2_{datetime.now():%Y-%m-%d_%H-%M-%S}.ipynb"
    nbformat.write(nb, fitxategia)

    for gelaxka in nb.cells:
        if gelaxka.cell_type == "code":
            for irteera in gelaxka.outputs:
                print(irteera.get("text", ""), end="")
    print(f"Emaitza gordeta: {fitxategia}")
    return fitxategia


def main():
    try:
        fitxategia = exekutatu()
    except Exception:
        idatzi_loga("ERROREA\n" + traceback.format_exc())
        raise
    idatzi_loga(f"Ondo exekutatuta: {fitxategia.name}")


if __name__ == "__main__":
    main()
