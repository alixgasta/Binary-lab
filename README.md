# Binary Lab

Web app didattica in italiano per la classe prima superiore. HTML, CSS e JavaScript senza framework, dipendenze, servizi esterni o procedure di compilazione.

## Avvio

Apri `index.html` con un browser aggiornato. Tutte le attività funzionano anche offline; solo i collegamenti alle guide esterne richiedono Internet. Non serve installare Node.js per usare il sito.

## File del pacchetto GitHub

- `index.html`: struttura, contenuti e schede.
- `style.css`: grafica pastello, layout responsive, modalità LIM e animazioni ridotte quando richiesto dal dispositivo.
- `app.js`: navigazione, interruttori dei bit, esercizi e punteggio.
- `math.js`: conversioni, riferimenti relativi e interprete ristretto delle formule.
- `manual.js`: spiegazioni dinamiche e procedimenti su carta, avanti/indietro.
- `sheets.js`: foglio simulato, tutorial, selezione delle celle e ricalcolo.
- `tests/math.test.cjs`: controlli dei calcoli e delle formule, eseguibili facoltativamente con Node.js.
- `lively.css` e `lively.js`: colori pastello, animazioni, sezione «Numerazione posizionale» e calcolatore di conversioni (decimale ⇄ binario, fino a 32 bit).
- `.nojekyll`: disattiva l'elaborazione Jekyll su GitHub Pages.
