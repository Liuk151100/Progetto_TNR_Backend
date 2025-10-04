import 'dotenv/config'; // importa il contenuto del file .env
import cors from 'cors'; // permette di gestire il CORS (chiamate da frontend su domini diversi da quello del backend)
import express from 'express';
import { connectDB } from './db.js';
import passport from "passport";
import googleStrategy from "./config/passportConfig.js";
import usersRouter from './routes/Users.js';

const port = process.env.PORT;

const server = express(); // creaiamo il server base

server.use(cors()); // accetta richieste da qualsiasi dominio
server.use(express.json()); // per gestire i body di tipo json

passport.use(googleStrategy); 

server.use("/users", usersRouter); 

connectDB()

// mettiamo il server in ascolto di richieste alla porta stabilita
server.listen(port, () => console.log(`Server avviato sulla porta ${port}`));