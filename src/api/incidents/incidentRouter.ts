import express, { type Router } from 'express';
import { incidentController } from './incidentController';

export const incidentRouter: Router = express.Router();

incidentRouter.get(
  '/getByCompanyId/:companyId',
  incidentController.getIncidents,
);

incidentRouter.get('/getById/:id', incidentController.getById);

incidentRouter.get('/getIoc', incidentController.getIoc);

incidentRouter.post('/create', incidentController.create);

incidentRouter.post('/update', incidentController.update);
