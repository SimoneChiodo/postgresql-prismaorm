
# Requisiti:
- Aver installato **PostgreSQL** dal *sito ufficiale* (`https://www.postgresql.org/download/`), includendo, durante il processo di installazione, il download di **pgAdmin**.
- Aver installato **Postman** per effettuare delle chiamate di test in comodità. Lo si può trovare sul *Microsoft Store* o sul *sito ufficiale* `https://www.postman.com/downloads/`.


# Step 1
Installiamo i pacchetti di *Prisma* con i comandi:  
- `npm install --save-dev prisma` → CLI per creare schema, migrazioni e client;  
- `npm install @prisma/client` → libreria che userai nel codice per fare query.  


# Step 2
Inizializziamo *Prisma* con il comando `npx prisma init`.  
Questo crea i percorsi:  
``` 
prisma/
  schema.prisma
.env
```

A questo punto dentro al file *.env* si troverà una riga come:  
`DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"`  
bisogna aggiornarla con i propri dati *PostgreSQL*.
Ad esempio:  
`DATABASE_URL="postgresql://username:password123@localhost:5432/test-database?schema=public"`


# Step 3
Aprire il file *schema.prisma*, posizionato dentro a `prisma/schema.prisma`.  
Questo contiene le informazioni che *Prisma* usa per connetersi al database.  
Contiene principalmente 2 sezioni:
- **Datasource** → dice a *Prisma* a quale database collegarsi e con quale provider:
```
datasource db {
  provider = "postgresql"         // tipo di database
  url      = env("DATABASE_URL")  // variabile .env con la connessione
}
```
- **Generator** → dice a Prisma che tipo di client generare:
```
generator client {
  provider = "prisma-client-js"    // client JS/TS per usare il DB nel codice
  output   = "../generated/prisma" // percorso in cui generare il client (default: node_modules/@prisma/client)
}
```

A queste si aggiungono i **modelli** → rappresentano tabelle del database e le loro colonne.  
Per il nostro progetto, noi aggiungiamo il modello User così:
```
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}
```


# Step 4
Adesso bisogna creare il database. Per fare ciò basta:
- aprire l'app ***pgAdmin***, installata insieme a *PostgreSQL*;
- espandere il server locale indicato con il nome `PostgreSQL <versione>` inserendo la password scelta durante l'installazione;
- fare click destro su `Databases` → `Create` → `Database`;
- inserire il nome del database e cliccare salva.


# Step 5
Adesso è possibile far migrare il codice scritto dentro a `schema.prisma` nel nostro database, trasformandolo in comandi SQL.  
Questo si fa scrivendo nel terminale il comando `npx prisma migrate dev --name init`, dove **init** sta per il nome che verrà dato alla migrazione.  
*Prisma* crea una cartella che contiene tutte le migrazioni effettuate sul database, che si trova al percorso:
```
prisma/migrations/
  20250925180912_init/   // Nome della migrazione, formato da "<data e ora>_<nome migrazione>"
    migration.sql
```
Questa funzionalità di *Prisma* ci torna utile perché permette di:
- capire cosa è cambiato;
- ripristinare versioni precedenti;
- lavorare in team senza sovrascrivere i database degli altri.


# Step 6
Ora concentriamoci sullo scrivere codice dentro a `app.js`.   
Importiamo il necessario con:
``` javascript
require("dotenv").config();           // Importo il dotenv
const express = require('express');   // Importo il Framework di Express

// Adesso importo il client Prisma (dal percorso specificato nella variabile "output" dentro a schema.prisma)
// Questo client ci permette di fare query al database PostgreSQL usando JavaScript/TypeScript in modo tipizzato e sicuro.
const { PrismaClient } = require('./generated/prisma'); 
``` 

Creiamo le variabili:
``` javascript
const prisma = new PrismaClient();      // Crea un'istanza del Client Prisma
const app = express();                  // Crea un'istanza di Express
const PORT = process.env.PORT || 3000;  // Legge la variabile PORT dal file .env, altrimenti usa 3000
app.use(express.json());                // È un middleware di Express che permette di interpretare il body delle richieste in JSON (necessario per ricevere dati dalle chiamate POST in formato JSON)
```  

Creiamo delle rotte:
``` javascript
// Rotta GET per leggere tutti gli utenti
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();   // "prisma.user.findMany()": Prisma legge tutti i record della tabella User dal database
  res.json(users);                              // Invia la risposta al client in formato JSON
});

// Rotta POST per creare un nuovo utente
app.post('/users', async (req, res) => {
  const { name, email } = req.body;             // Prende i dati inviati dal client
  const newUser = await prisma.user.create({    // "prisma.user.create": crea un nuovo record nella tabella User
    data: { name, email }
  });
  res.json(newUser);                            // Invia al client una copia del nuovo utente in formato JSON
});
``` 

Creiamo la funzione per avviare il server:
``` javascript
// Fa partire il server Express e lo mette in ascolto sulla porta PORT (importata prima dal .env)
app.listen(PORT, () => { 
  console.log(`Server online all'indirizzo: http://localhost:${PORT}`);
});
```


# Step 7
Ora possiamo finalmente testare il nostro server con *Postman*.  
Una volta aperto possiamo creare le nostre chiamate di test, entrambe all'indirizzo `http://localhost:3000/users`.
- **Chiamata GET** → per ottenere tutti gli utenti salvati sul database.
- **Chiamata POST** → cambiamo la sezione da *"Params"* a *"Body"* e selezioniamo il radio button chiamato *"raw"*. Nel box di testo che comparirà in basso inseriamo del codice JSON per creare un nuovo utente (*come quello nell'esempio qua in basso ↓*). Una volta effettuata la chiamata otteremmo in risposta il nuovo utente creato.
``` json
{
    "_comment": "Codice JSON di esempio per la creazione di un utente",
    "name": "Utente1",
    "email": "email@example.com"
}
```
