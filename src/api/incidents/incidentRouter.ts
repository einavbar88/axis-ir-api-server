import express, { type Router } from 'express';
import { reportController } from './incidentController';

export const incidentRouter: Router = express.Router();

incidentRouter.get('/getAll/:companyId', reportController.getIncidents);

incidentRouter.get('/getById/:id', reportController.getById);

incidentRouter.post('/create', reportController.create);
