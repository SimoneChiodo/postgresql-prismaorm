
# Step 1
Installiamo i pacchetti di prisma con i comandi:  
- `npm install --save-dev prisma`  
- `npm install @prisma/client`  
#### NOTE:  
- **prisma** → CLI per creare schema, migrazioni e client.  
- **@prisma/client** → libreria che userai nel codice per fare query.  

# Step 2
Inizializziamo prisma con il comando `npx prisma init`.  
Questo crea i percorsi:  
``` 
prisma/
  schema.prisma
.env
```

A questo punto dentro al file *.env* si troverà una riga come:  
`DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"`  
bisogna aggiornarla con i propri dati PostgreSQL.
Ad esempio:  
`DATABASE_URL="postgresql://username:password123@localhost:5432/test-database?schema=public"`

# Step 3
Aprire il file *schema.prisma*, contenuto dentro a `prisma/schema.prisma`.  
Questo contiene le informazioni che Prisma usa per connetersi al database.  
Contiene principalmente 2 sezioni:
- **Datasource** → dice a Prisma a quale database collegarsi e con quale provider:
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
Noi aggiungiamo gli utenti così:
```
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}
```