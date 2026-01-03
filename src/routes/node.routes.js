import express from 'express';
import NodeController from '../controllers/node.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // Opcional: Proteger rotas

const router = express.Router();

// Rotas públicas ou protegidas? A princípio vamos deixar abertas ou com middleware opcional 
// dado que é uma integração "simples", mas idealmente deve ter auth.
// Com Auth: router.use(AuthMiddleware.checkToken);

router.get('/', NodeController.getNodes);
router.post('/', NodeController.createNode);
router.patch('/:id', NodeController.updateNode);

export default router;
