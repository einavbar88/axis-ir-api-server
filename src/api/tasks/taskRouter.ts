import express, { type Router } from 'express';
import { taskController } from './taskController';

export const taskRouter: Router = express.Router();

taskRouter.get('/getByIncidentId/:incidentId', taskController.getByIncidentId);

taskRouter.get('/getById/:id', taskController.getById);

taskRouter.post('/getAllTasks', taskController.getAllTasks);

taskRouter.post('/create', taskController.create);

taskRouter.post('/update', taskController.update);
