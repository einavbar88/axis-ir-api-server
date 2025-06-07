import express, { type Router } from 'express';
import { taskController } from './taskController';
import { authMiddleware } from '@/common/middleware/authMiddleware';

export const taskRouter: Router = express.Router();

taskRouter.get(
  '/getByIncidentId/:incidentId',
  authMiddleware,
  taskController.getByIncidentId,
);

taskRouter.get('/getById/:id', authMiddleware, taskController.getById);

taskRouter.post('/getAllTasks', authMiddleware, taskController.getAllTasks);

taskRouter.post('/create', authMiddleware, taskController.create);

taskRouter.post('/update', authMiddleware, taskController.update);
