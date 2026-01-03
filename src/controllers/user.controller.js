import { prisma } from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserSchema } from '../validators/schemas.js';

export async function createUser(req, res, next) {
  try {
    // Validação com Zod
    const validatedData = createUserSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Verifica se já existe
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        createdAt: true,
      },
    });

    // Gerar token logo após o cadastro
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      token, // Token retornado aqui
      user
    });
  } catch (error) {
    next(error);
  }
}
