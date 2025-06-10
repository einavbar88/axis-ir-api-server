import express, { type Router } from 'express';
import { indicatorController } from './indicatorController';
import { authMiddleware } from '@/common/middleware/authMiddleware';

export const indicatorRouter: Router = express.Router();

indicatorRouter.get('/', authMiddleware, indicatorController.getIndicators);

indicatorRouter.get('/:id', authMiddleware, indicatorController.getById);

indicatorRouter.post('/create', authMiddleware, indicatorController.create);

indicatorRouter.post('/update', authMiddleware, indicatorController.update);

indicatorRouter.delete('/:id', authMiddleware, indicatorController.delete);
