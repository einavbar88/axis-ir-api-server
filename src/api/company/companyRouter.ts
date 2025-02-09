import express, { type Router } from 'express';
import { companyController } from './companyController';
import { authMiddleware } from '@/common/middleware/authMiddleware';

export const companyRouter: Router = express.Router();

// companyRouter.get('/:id', authMiddleware, companyController.getCompany);

companyRouter.get(
  '/getByUserId',
  authMiddleware,
  companyController.getCompanies,
);

companyRouter.post(
  '/assignUserRoleToCompany',
  authMiddleware,
  companyController.assignUserRoleToCompany,
);

companyRouter.post('/create', authMiddleware, companyController.createCompany);
