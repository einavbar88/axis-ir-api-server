import express, { type Router } from 'express';
import { incidentController } from './incidentController';
import { authMiddleware } from '@/common/middleware/authMiddleware';

export const incidentRouter: Router = express.Router();

incidentRouter.get(
  '/getByCompanyId/:companyId',
  incidentController.getIncidents,
);

incidentRouter.get('/getById/:id', authMiddleware, incidentController.getById);

incidentRouter.get('/getIoc', authMiddleware, incidentController.getIoc);

incidentRouter.post('/create', authMiddleware, incidentController.create);

incidentRouter.post('/update', authMiddleware, incidentController.update);

incidentRouter.post(
  '/generate-report/:id',
  authMiddleware,
  incidentController.generateReport,
);
