# Binary Lab

Web app didattica in italiano per la classe prima superiore. HTML, CSS e JavaScript senza framework, dipendenze, servizi esterni o procedure di compilazione.

## Avvio

Apri `index.html` con un browser aggiornato. Tutte le attività funzionano anche offline; solo i collegamenti alle guide esterne richiedono Internet. Non serve installare Node.js per usare il sito.

## File del pacchetto GitHub

- `index.html`: struttura, contenuti e schede.
- `style.css`: grafica blu/pastello, layout responsive, modalità LIM e animazioni ridotte quando richiesto dal dispositivo.
- `app.js`: navigazione, interruttori dei bit, esercizi e punteggio.
- `math.js`: conversioni, riferimenti relativi e interprete ristretto delle formule.
- `manual.js`: spiegazioni dinamiche e procedimenti su carta, avanti/indietro.
- `sheets.js`: foglio simulato, tutorial, selezione delle celle e ricalcolo.
- `tests/math.test.cjs`: controlli dei calcoli e delle formule, eseguibili facoltativamente con Node.js.
- `lively.css` e `lively.js`: colori pastello, animazioni, sezione «Numerazione posizionale» e calcolatore di conversioni (decimale ⇄ binario, fino a 32 bit).
- `.nojekyll`: disattiva l'elaborazione Jekyll su GitHub Pages.

I file del sito devono restare nella stessa cartella. Non rinominarli senza aggiornare i riferimenti nell'HTML. Nel repository di lavoro ospitato i file del sito si trovano in `dist/`; nello ZIP consegnato sono già nella cartella principale, pronti per GitHub Pages.

## Pubblicazione su GitHub Pages

1. Estrai lo ZIP sul computer.
2. Crea un repository GitHub (pubblico se usi GitHub Free).
3. Carica **il contenuto della cartella estratta**, non il file ZIP. `index.html` deve trovarsi nella cartella principale del repository.
4. Apri **Settings → Pages**.
5. In **Build and deployment → Source**, scegli **Deploy from a branch**.
6. Seleziona il branch che contiene i file, normalmente **main**, e la cartella **/(root)**. Premi **Save**.
7. Attendi il completamento della pubblicazione e apri l'indirizzo mostrato da GitHub Pages.

Non è necessario configurare chiavi API, un database o un backend. Il sito non raccoglie dati personali. Lo stato degli esercizi e le modifiche alle celle restano in memoria e si azzerano ricaricando la pagina. Il sito pubblicato con Pages è accessibile tramite il suo URL.

Guida ufficiale: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Percorso didattico

1. **Esplora i bit**: pesi, contributi, 4/8 bit, incremento, riporto e limite della rappresentazione.
2. **Le basi**: confronto base 10/base 2, posizione, potenze, bit/byte e zeri iniziali.
3. **Converti**: interi senza segno da 0 a 65535. Divisioni con quoziente, resto e collegamento al passaggio seguente; lettura dei resti in ordine inverso. Conversione inversa con posizioni, potenze, prodotti, somma e controllo.
4. **Google Fogli**: simulazione locale ispirata al file di esercizi del docente, con 10 o 16 bit.
5. **Mettiti alla prova**: direzione mista o selezionata, tre livelli, indizi, tentativi e soluzione spiegata.

La modalità LIM nasconde l'introduzione e aumenta le dimensioni dei contenuti principali. Le animazioni evidenziano solo un cambiamento utile (avanzamento del procedimento e lettura dei resti). Non ci sono riproduzione automatica, suoni o effetti decorativi continui.

## Il simulatore di Google Fogli

Non è un'integrazione con Google, un iframe o un foglio remoto. Riproduce solo le operazioni necessarie al percorso: selezione, inserimento nella barra formula con Invio/✓, riferimenti evidenziati, ricalcolo e riempimento tramite pulsante guidato. Per avanzare nel tutorial è richiesta la formula didattica indicata (si accettano i nomi inglesi equivalenti); una formula alternativa può calcolare correttamente ma non soddisfare quella specifica consegna.

Il pulsante “Inserisci formula suggerita” la mette nella barra: bisogna poi confermarla. Le formule già scritte restano quando si torna al passaggio precedente; il pulsante di ripristino le cancella. Cambiare dimensione o procedimento inizia un nuovo tutorial.

Supporta: `INT`, `RESTO`/`MOD`, `CONCATENA`/`CONCATENATE`, `SOMMA`/`SUM`, riferimenti, intervalli, operatori `+ - * / ^` e parentesi. Accetta `;` e `,` come separatori degli argomenti. Non supporta la sintassi completa di Google Fogli: per esempio stringhe tra virgolette, matrici, riferimenti ad altri fogli e funzioni diverse non sono implementati. Gli intervalli del parser sono limitati ad A1:Z100, sufficienti per il laboratorio.

Nessun `eval` o esecuzione di codice inserito nelle formule. Sono segnalati formule non supportate, divisioni per zero e riferimenti circolari.

### Fedeltà al file del docente

- **Esercizio 1**: input B14, divisore C14, `=INT(B14/C14)` in D14 e `=RESTO(B14;C14)` in E14. Si prosegue verso l'alto fino alla riga 5, poi `=CONCATENA(E5:E14)` in D17. Esempi: 113, 475, 275.
- **Esercizio 3**: esponenti in C4:L4, bit in C5:L5, contributi in C6:L6 e `=SOMMA(C6:L6)` in E7. Esempi: 1000000001, 0001010001 e 1111111111.
- L'estensione a 16 bit permette 1067, 2367, 48790 e 111100001010, presenti nelle consegne aggiuntive.

Le divisioni del foglio vanno dal basso verso l'alto: i resti si concatenano dall'alto verso il basso. Nel procedimento su carta dell'app, invece, le divisioni scendono: i resti si leggono dal basso verso l'alto. La regola è sempre leggere i resti nell'ordine inverso rispetto alle divisioni.

Tutte le attività interpretano numeri **senza segno**. L'approfondimento distingue questo modello dalle funzioni native `DECIMALE.BINARIO` e `BINARIO.DECIMALE`, che hanno limiti e convenzioni proprie. In particolare 1000000001 senza segno vale 513, mentre BINARIO.DECIMALE lo interpreta come −511. Le funzioni pronte BASE e DECIMALE sono spiegate per l'uso nel vero Google Fogli, non nella barra del simulatore.

## Verifiche

Eseguire, facoltativamente: `node tests/math.test.cjs`.

Controlli effettuati: divisioni e somma posizionale per tutti i 65536 valori da 0 a 65535; modelli del foglio a 10 e 16 bit su valori significativi e limiti; nomi inglesi, riferimenti relativi, errori sintattici, divisione per zero e cicli. Verificati nel browser i tutorial in entrambe le direzioni e il ricalcolo dopo modifica dei dati.

## Fonti tecniche

- https://support.google.com/docs/table/25273?hl=it
- https://support.google.com/docs/answer/3094123?hl=it
- https://support.google.com/docs/answer/3092997?hl=it
- https://support.google.com/docs/answer/3092991
- https://support.google.com/docs/answer/9084167?hl=it
- https://support.google.com/docs/answer/9116090?hl=it
- https://support.google.com/docs/answer/58515?hl=it

Il file Excel originale non è incluso nello ZIP: il pacchetto contiene il sito e i suoi test, senza documenti personali, credenziali o dati del servizio di hosting.
