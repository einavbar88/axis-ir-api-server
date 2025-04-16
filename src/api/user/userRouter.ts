import express, { type Router } from 'express';
import { userController } from './userController';

export const userRouter: Router = express.Router();

userRouter.get('/:id', userController.getUser);

userRouter.get('/getRoles/all', userController.getRoles);

userRouter.get('/inviteUser/all', (req, res) => res.status(200).send('hi'));

userRouter.post('/login', userController.login);

userRouter.post('/tokenLogin', userController.tokenLogin);

userRouter.post('/logout', userController.revokeToken);

userRouter.post('/signup', userController.signup);

userRouter.post('/update/:id', userController.updateUserDetails);

userRouter.post('/inviteUser/:companyId', userController.inviteUser);
