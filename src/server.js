import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { z } from 'zod';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

const whitelist = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://vision-log-seven.vercel.app', // URL da Vercel
    'https://vision-log.vercel.app', 
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.warn(`Blocked by CORS: ${origin}`);
            callback(null, true); // Temporariamente permitindo tudo para debug, mas logando warning. Em prod, usar callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}));

app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API',
      version: '1.0.0',
      description: 'Documentação da API do Backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Arquivos onde estarão os comentários JSDoc
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Rota health check
app.get('/', (req, res) => {
  res.send('ERP API rodando 🚀');
});

// Middleware de Erros Global
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: err.errors
    });
  }

  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
