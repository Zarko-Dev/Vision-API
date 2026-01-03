import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { loginSchema } from '../validators/schemas.js';

export class AuthController {
    static async login(req, res, next) {
        try {
            // 1. Validar entrada
            const { email, password } = loginSchema.parse(req.body);

            // 2. Buscar usuário
            const user = await prisma.user.findUnique({
                where: { email }
            });

            console.log('Login attempt for:', email);
            console.log('User found:', !!user);

            if (!user || !user.active) {
                console.log('User not found or inactive. Active:', user?.active);
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // 3. Comparar senha
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);
            console.log('Password match:', passwordMatch);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // 4. Gerar token
            const token = jwt.sign(
                {
                    sub: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // 5. Atualizar último login
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() }
            });

            // 6. Retornar resposta (SEM senha)
            return res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async me(req, res) {
        return res.json(req.user);
    }
}
