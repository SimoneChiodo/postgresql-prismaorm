
# Step 1
Ho installato i pacchetti di prisma con i comandi:  
- `npm install --save-dev prisma`  
- `npm install @prisma/client`  
#### NOTE:  
- **prisma** → CLI per creare schema, migrazioni e client.  
- **@prisma/client** → libreria che userai nel codice per fare query.  

# Step 2
Ho inizializzato prisma con il comando `npx prisma init`.  
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
