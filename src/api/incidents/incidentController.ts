import type { Request, RequestHandler, Response } from 'express';

import { incidentService } from '@/api/incidents/incidentService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import type { TimeFrames } from '@/common/utils/queryHelper';

class IncidentController {
  private isInitialized = false;

  public async init() {
    if (!this.isInitialized) {
      await incidentService.init();
      this.isInitialized = true;
    }
  }

  public getIncidents: RequestHandler = async (
    _req: Request,
    res: Response,
  ) => {
    const serviceResponse = await incidentService.findAll(
      Number(_req.params.companyId),
      _req.query.timeFrame as TimeFrames,
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public getById: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await incidentService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public create: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await incidentService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public update: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await incidentService.update(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const reportController = new IncidentController();
reportController.init();
