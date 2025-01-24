import type { Request, RequestHandler, Response } from 'express';

import { reportService } from '@/api/report/reportService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

class ReportController {
  private isInitialized = false;

  public async init() {
    if (!this.isInitialized) {
      await reportService.init();
      this.isInitialized = true;
    }
  }

  public getReports: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await reportService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getReport: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await reportService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createReport: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await reportService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const reportController = new ReportController();
reportController.init();
