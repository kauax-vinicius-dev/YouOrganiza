import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { user } from '../models/userModel.js';
import validator from 'validator';
import { InputValidator } from '../validators/Validator.js';

export class AuthService {
    static async loginUser({ email, password }) {
        InputValidator.checkIfFieldIsEmpty(email, 'email');
        InputValidator.checkIfFieldIsEmpty(password, 'password');
        if (!validator.isEmail(email)) {
            throw { status: 400, msg: 'Email invalido' };
        }
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_SENHA) {
            const token = jwt.sign(
                {
                    id: 'admin-root',
                    role: 'admin'
                },
                process.env.JWT_SECRET_ADMIN,
                { expiresIn: '1d' }
            );
            return { token, role: 'admin', userName: 'YOU.BPOTECH', position: 'Administrador' };
        }
        const existingUser = await user.findOne({ email: email });
        InputValidator.throwIfFalse(existingUser, 'User não encontrado');
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        InputValidator.throwIfFalse(matchPassword, 'Email ou senha inválidos');
        const token = jwt.sign(
            {
                id: existingUser.id,
                role: existingUser.credential
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        const userName = existingUser.name;
        const position = existingUser.position;
        return { token, role: existingUser.credential, userName, position };
    }
    static async createUser({ name, email, password, credential, position }) {
        InputValidator.checkIfFieldIsEmpty(name, 'name');
        InputValidator.checkIfFieldIsEmpty(email, 'email');
        InputValidator.checkIfFieldIsEmpty(password, 'password');
        const allowed = ['admin', 'tech', 'user'];
        InputValidator.checkIfFieldIsEmpty(credential, 'credential');
        if (!allowed.includes(credential)) {
            throw { status: 400, msg: 'credential invalida' };
        }
        InputValidator.checkIfFieldIsEmpty(position, 'position');
        InputValidator.hasNoNumbers(name, 'name');
        InputValidator.hasNoNumbers(credential, 'credential');
        if (!validator.isEmail(email)) {
            throw { status: 400, msg: 'Email invalido' };
        }
        if (email === process.env.ADMIN_EMAIL) {
            throw { status: 403, msg: 'Este email é reservado para administração' };
        }
        const existingUser = await user.findOne({ email: email });
        InputValidator.throwIfTrue(existingUser, 'email ja cadastrado');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new user({
            name,
            email,
            password: passwordHash,
            credential,
            position,
        });

        await newUser.save();
    }
}