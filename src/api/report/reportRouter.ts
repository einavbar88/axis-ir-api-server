import express, { type Router } from 'express';
import { reportController } from './reportController';

export const reportRouter: Router = express.Router();

reportRouter.get('/', reportController.getReports);

reportRouter.get('/:id', reportController.getReport);

reportRouter.post('/create', reportController.createReport);
