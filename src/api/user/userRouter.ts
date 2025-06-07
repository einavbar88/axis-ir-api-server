import express, { type Router } from 'express';
import { userController } from './userController';
import { authMiddleware } from '@/common/middleware/authMiddleware';

export const userRouter: Router = express.Router();

userRouter.get('/:id', authMiddleware, userController.getUser);

userRouter.get('/getRoles/all', authMiddleware, userController.getRoles);

userRouter.get(
  '/getByCompanyId/:companyId',
  authMiddleware,
  userController.getByCompanyId,
);

userRouter.post('/login', userController.login);

userRouter.post('/tokenLogin', userController.tokenLogin);

userRouter.post('/logout', userController.revokeToken);

userRouter.post('/signup', userController.signup);

userRouter.post(
  '/update/:id',
  authMiddleware,
  userController.updateUserDetails,
);

userRouter.post(
  '/inviteUser/:companyId',
  authMiddleware,
  userController.inviteUser,
);

userRouter.post(
  '/changeRole/:companyId',
  authMiddleware,
  userController.changeUserRole,
);
