import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';

export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não informado' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: payload.sub }
        });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido' });
    }
}
