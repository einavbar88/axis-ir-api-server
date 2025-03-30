import type { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';
import { Asset } from '@/entities/Asset';

export class AssetService {
  private assetRepository!: Repository<Asset>;

  async init() {
    this.assetRepository = await getRepository(Asset);
  }

  async findByCompanyId(
    companyId: number,
  ): Promise<ServiceResponse<Asset[] | null>> {
    try {
      const assets = await this.assetRepository.find({
        where: { companyId },
      });

      if (!assets || assets.length === 0) {
        return ServiceResponse.failure(
          'No assets found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<Asset[]>('assets found', assets);
    } catch (ex) {
      const errorMessage = `Error finding all assets: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving assets.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Asset | null>> {
    try {
      const asset = await this.assetRepository.findOne({
        where: { assetId: id },
      });
      if (!asset) {
        return ServiceResponse.failure(
          'asset not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<Asset>('Asset found', asset);
    } catch (ex) {
      const errorMessage = `Error finding asset with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding asset.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByAssetGroup(
    assetGroupId: number,
  ): Promise<ServiceResponse<Asset[] | null>> {
    try {
      if (!assetGroupId) {
        return ServiceResponse.failure(
          'asset group id is missing',
          null,
          StatusCodes.BAD_REQUEST,
        );
      }
      const assets = await this.assetRepository.find({
        where: { assetGroupId },
      });

      if (!assets) {
        return ServiceResponse.failure(
          'no assets found',
          null,
          StatusCodes.FORBIDDEN,
        );
      }

      return ServiceResponse.success('assets found', assets);
    } catch (ex) {
      const errorMessage = `error getting assets for asset group id ${assetGroupId}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding assets.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(asset: Asset): Promise<ServiceResponse<Partial<Asset> | null>> {
    try {
      const newAsset = await this.assetRepository.save(asset);
      await this.assetRepository.save(asset);
      return ServiceResponse.success<Partial<Asset>>('Asset created', {
        assetId: newAsset.assetId,
      });
    } catch (ex) {
      const errorMessage = `Error creating Asset: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating Asset.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const assetService = new AssetService();
