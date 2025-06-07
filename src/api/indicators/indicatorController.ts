import type { Request, RequestHandler, Response } from 'express';

import { indicatorService } from '@/api/indicators/indicatorService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import type { TimeFrames } from '@/common/utils/queryHelper';

class IndicatorController {
  private isInitialized = false;

  public async init() {
    if (!this.isInitialized) {
      await indicatorService.init();
      this.isInitialized = true;
    }
  }

  public getIndicators: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const serviceResponse = await indicatorService.findAll(
      req.query.timeFrame as TimeFrames,
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public getById: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await indicatorService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public create: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await indicatorService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public update: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await indicatorService.update(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await indicatorService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const indicatorController = new IndicatorController();
indicatorController.init();
