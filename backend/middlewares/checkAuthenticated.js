import jwt from 'jsonwebtoken';

export class AuthMiddleware {
    static authenticate(req, res, next) {
        if (!process.env.JWT_SECRET) {
            console.error('❌ JWT_SECRET não configurado');
            return res.status(500).json({ msg: 'Erro de configuração do servidor' });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: 'Token não fornecido' });
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ msg: 'Formato inválido. Use: Bearer <token>' });
        }
        const token = parts[1];
        try {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
                req.user = decoded;
                return next();
            } catch (adminErr) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                return next();
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ msg: 'Token expirado' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ msg: 'Token inválido' });
            }
            return res.status(401).json({ msg: 'Erro na autenticação' });
        }
    }
    static isAdmin(req, res, next) {
        if (!req.user) {
            return res.status(401).json({ msg: 'Autenticação necessária' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Acesso negado - apenas administradores' });
        }
        return next();
    }
}