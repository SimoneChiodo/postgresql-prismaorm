// require("dotenv").config(); // Necessario nelle versioni precedenti a Node.js 20.6 (come scritto nel package.json)
const express = require('express'); 
const { PrismaClient } = require('./generated/prisma'); // Importo il client Prisma dal percorso specificato in schema.prisma

const app = express();
const prisma = new PrismaClient(); // Istanza del client di Prisma (usata per fare chiamate al db)
const PORT = process.env.PORT || 3000;  // Porta usata dal programma
app.use(express.json());


// Rotta per leggere tutti gli utenti
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Rotta per creare un nuovo utente
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({
    data: { name, email }
  });
  res.json(newUser);
});


// Il programma è in ascolto
app.listen(PORT, () => {
  console.log(`Server online all'indirizzo: http://localhost:${PORT}`);
});