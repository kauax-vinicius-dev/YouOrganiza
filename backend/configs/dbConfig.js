import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const conectarMongo = () => {
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;
  mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.h3x40l2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
    .then(() => {
      console.log('Conectado ao banco de dados');
    })
    .catch((err) => console.log('Erro ao conectar ao banco:', err));
}
