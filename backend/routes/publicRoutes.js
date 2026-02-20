import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
const publicRoutes = Router();

//POST Routes - Auth
publicRoutes.post('/auth/login', AuthController.login);

export default publicRoutes;