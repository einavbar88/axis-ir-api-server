import type { Request, RequestHandler, Response } from 'express';

import { userService } from '@/api/user/userService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

class UserController {
  private isInitialized = false;

  public async init() {
    if (!this.isInitialized) {
      await userService.init();
      this.isInitialized = true;
    }
  }

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateUserDetails: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.updateUserDetails(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public signup: RequestHandler = async (req: Request, res: Response) => {
    const user = req.body;
    const serviceResponse = await userService.create(user);
    return handleServiceResponse(serviceResponse, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const serviceResponse = await userService.login(username, password);
    return handleServiceResponse(serviceResponse, res);
  };

  public tokenLogin: RequestHandler = async (req: Request, res: Response) => {
    const { token } = req.body;
    const serviceResponse = await userService.tokenLogin(token);
    return handleServiceResponse(serviceResponse, res);
  };

  public revokeToken: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.revokeToken(req.body.token);
    return handleServiceResponse(serviceResponse, res);
  };

  public getRoles: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.getRoles();
    return handleServiceResponse(serviceResponse, res);
  };

  public getByCompanyId: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const { companyId } = req.params;
    const serviceResponse = await userService.getByCompanyId(Number(companyId));
    return handleServiceResponse(serviceResponse, res);
  };

  public inviteUser: RequestHandler = async (req: Request, res: Response) => {
    const { email, role } = req.body;
    const { companyId } = req.params;
    const serviceResponse = await userService.inviteUser(
      email,
      role,
      Number(companyId),
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public changeUserRole: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const { userId, role } = req.body;
    const { companyId } = req.params;
    const serviceResponse = await userService.changeUserRole(
      userId,
      role,
      Number(companyId),
    );
    return handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
userController.init();
