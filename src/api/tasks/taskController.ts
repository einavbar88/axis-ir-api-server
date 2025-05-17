import type { Request, RequestHandler, Response } from 'express';
import { taskService } from './taskService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

class TaskController {
  private isInitialized = false;

  public async init() {
    if (!this.isInitialized) {
      await taskService.init();
      this.isInitialized = true;
    }
  }

  public getAllTasks: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await taskService.findAll(req.body.incidentIds);
    return handleServiceResponse(serviceResponse, res);
  };

  public getById: RequestHandler = async (req: Request, res: Response) => {
    const taskId = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await taskService.findById(taskId);
    return handleServiceResponse(serviceResponse, res);
  };
  public getByIncidentId: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const incidentId = Number.parseInt(req.params.incidentId as string, 10);
    const serviceResponse = await taskService.findByIncidentId(incidentId);
    return handleServiceResponse(serviceResponse, res);
  };

  public create: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await taskService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public update: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await taskService.update(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const taskController = new TaskController();
taskController.init();
