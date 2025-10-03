# Operatore 118

Simulatore per la gestione delle chiamate di emergenza per il servizio 118 italiano.

## Prerequisiti

Prima di iniziare, assicurati di avere installato:

- [Node.js](https://nodejs.org/) (versione 18 o superiore)
- [npm](https://www.npmjs.com/) (solitamente viene installato con Node.js)

## Installazione

1. Clona il repository:
```bash
git clone https://github.com/federicohaag/operatore-118.git
```

2. Entra nella directory del progetto:
```bash
cd operatore-118
```

3. Installa le dipendenze:
```bash
npm install
```

## Avvio dell'applicazione in locale

Per avviare l'applicazione in modalità sviluppo:

```bash
npm run dev
```

L'applicazione sarà accessibile all'indirizzo [http://localhost:5173](http://localhost:5173)

## Struttura del Progetto

Il progetto è organizzato nelle seguenti cartelle principali:

- `/src` - Codice sorgente dell'applicazione
  - `/modules` - Moduli funzionali dell'applicazione
  - `/assets` - Risorse statiche (immagini, suoni, ecc.)
- `/public` - File statici accessibili pubblicamente

## Build per la Produzione

Per creare una build ottimizzata per la produzione:

```bash
npm run build
```

I file di build saranno generati nella cartella `dist`.

## Tecnologie Utilizzate

- React
- TypeScript
- Vite
- CSS Modules

## Licenza

[Inserire informazioni sulla licenza]

## Contribuire

[Inserire istruzioni per contribuire al progetto]