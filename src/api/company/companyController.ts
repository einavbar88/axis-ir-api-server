import type { Request, RequestHandler, Response } from 'express';
import { companyService } from '@/api/company/companyService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import type { User } from '@/entities/User';

class CompanyController {
  private isInitialized = false;

  public async init() {
    if (!this.isInitialized) {
      await companyService.init();
      this.isInitialized = true;
    }
  }

  public getCompanies: RequestHandler = async (
    req: Request & { user?: User },
    res: Response,
  ) => {
    const userId = req.user?.userId as number;
    const serviceResponse = await companyService.findByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getCompanyById: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const id = req.params.id;
    const serviceResponse = await companyService.findById(Number(id));
    return handleServiceResponse(serviceResponse, res);
  };

  public assignUserRoleToCompany: RequestHandler = async (
    req: Request & { user?: User },
    res: Response,
  ) => {
    const user = req.user as User;
    const { companyId, email, roleId } = req.body;
    const serviceResponse = await companyService.assignUserRoleToCompany(
      user.userId,
      companyId,
      email,
      roleId,
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public createCompany: RequestHandler = async (
    req: Request & { user?: User },
    res: Response,
  ) => {
    const user = req.user as User;
    const serviceResponse = await companyService.create(req.body, user.userId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const companyController = new CompanyController();
companyController.init();
