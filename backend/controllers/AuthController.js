import { AuthService } from '../services/AuthService.js';

export class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, role, userName, position } = await AuthService.loginUser({ email, password });
            return res.status(200).json({
                msg: 'Login realizado com sucesso',
                token,
                role,
                userName,
                position
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
    static async createUser(req, res) {
        try {
            const { name, email, password, credential, position } = req.body;
            await AuthService.createUser({ name, email, password, credential, position });
            return res.status(201).json({ msg: 'Usuário criado com sucesso' });
        } catch (error) {
            return res.status(error.status || 500).json({
                msg: error.msg || 'Erro no servidor'
            });
        }
    }
}