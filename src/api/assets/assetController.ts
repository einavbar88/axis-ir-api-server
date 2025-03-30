import type { Request, RequestHandler, Response } from 'express';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { assetService } from '@/api/assets/assetService';
import { Asset } from '@/entities/Asset';
import type { CreateAssetDto } from './dto/createAsset.ts';

class AssetController {
  private isInitialized = false;

  public async init() {
    if (!this.isInitialized) {
      await assetService.init();
      this.isInitialized = true;
    }
  }

  public getAssetsByCompanyId: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const companyId = Number(req.params.companyId);
    const serviceResponse = await assetService.findByCompanyId(companyId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAssetById: RequestHandler = async (req: Request, res: Response) => {
    const assetId = Number(req.params.id);
    const serviceResponse = await assetService.findById(assetId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAssetsByAssetGroup: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    const assetGroupId = Number(req.params.assetGroupId);
    const serviceResponse = await assetService.findByAssetGroup(assetGroupId);
    return handleServiceResponse(serviceResponse, res);
  };

  public createAsset: RequestHandler = async (req: Request, res: Response) => {
    const assetData: CreateAssetDto = req.body;

    // Create a new Asset object from the DTO
    const asset = new Asset();
    Object.assign(asset, assetData);

    const serviceResponse = await assetService.create(asset);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const assetController = new AssetController();
assetController.init();
