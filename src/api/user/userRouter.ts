import express, { type Router } from 'express';
import { userController } from './userController';

export const userRouter: Router = express.Router();

userRouter.get('/:id', userController.getUser);

userRouter.post('/login', userController.login);

userRouter.post('/tokenLogin', userController.tokenLogin);

userRouter.post('/revoke', userController.revokeToken);

userRouter.post('/signup', userController.signup);

userRouter.post('/update/:id', userController.updateUserDetails);
