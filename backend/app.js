import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { conectarMongo } from './configs/dbConfig.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

// Carregar .env
dotenv.config();

// Express
const app = express();
const port = 3040;
const httpServer = createServer(app);

// Database
conectarMongo();

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Cookies
app.use(cookieParser());

// Rotas
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/', apiRoutes);

// Iniciar servidor
httpServer.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`http://localhost:${port}`);
});