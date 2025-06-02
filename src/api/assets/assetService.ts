import type { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';
import { Asset } from '@/entities/Asset';
import { AssetGroup } from '@/entities/AssetGroup';
import { AssetGroupAssign } from '@/entities/AssetGroupAssign';
import { IndicatorLink } from '@/entities/IndicatorLink';
import {
  getAnyOf,
  getTimeFrameQuery,
  type TimeFrames,
} from '@/common/utils/queryHelper';

type WithGroups = Asset & { groups: number[] };

const getGroupsIds = (assigns: AssetGroupAssign[]) => {
  return assigns.map((assign) => assign.assetGroupId);
};

export class AssetService {
  private assetRepository!: Repository<Asset>;
  private assetGroupRepository!: Repository<AssetGroup>;
  private assetGroupAssignRepository!: Repository<AssetGroupAssign>;
  private indicatorLinkRepository!: Repository<IndicatorLink>;

  async init() {
    this.assetRepository = await getRepository(Asset);
    this.assetGroupRepository = await getRepository(AssetGroup);
    this.assetGroupAssignRepository = await getRepository(AssetGroupAssign);
    this.indicatorLinkRepository = await getRepository(IndicatorLink);
  }

  async findByCompanyId(
    companyId: number,
  ): Promise<ServiceResponse<WithGroups[] | null>> {
    try {
      const assets = await this.assetRepository.find({
        where: { companyId },
      });
      const withGroups = [];

      if (!assets || assets.length === 0) {
        return ServiceResponse.failure(
          'No assets found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      for await (const asset of assets) {
        const assigns = await this.assetGroupAssignRepository.find({
          where: { assetId: asset.assetId },
        });
        withGroups.push({ ...asset, groups: getGroupsIds(assigns) });
      }

      return ServiceResponse.success<WithGroups[]>('assets found', withGroups);
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

  async findById(id: number): Promise<ServiceResponse<WithGroups | null>> {
    try {
      const asset = await this.assetRepository.findOne({
        where: { assetId: id },
      });

      const assigns = await this.assetGroupAssignRepository.find({
        where: { assetId: id },
      });

      if (!asset) {
        return ServiceResponse.failure(
          'asset not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<WithGroups>('Asset found', {
        ...asset,
        groups: getGroupsIds(assigns),
      });
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

  async findAssetGroups(
    id: number,
  ): Promise<ServiceResponse<AssetGroup[] | null>> {
    try {
      const assetGroups = await this.assetGroupRepository.find({
        where: { companyId: id },
      });
      if (!assetGroups) {
        return ServiceResponse.failure(
          'asset not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<AssetGroup[]>(
        'Asset groups found',
        assetGroups,
      );
    } catch (ex) {
      const errorMessage = `Error finding asset groups for company id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding asset groups.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAssetGroup(
    id: number,
  ): Promise<ServiceResponse<AssetGroup | null>> {
    try {
      const assetGroup = await this.assetGroupRepository.findOne({
        where: { assetGroupId: id },
      });
      if (!assetGroup) {
        return ServiceResponse.failure(
          'Asset group not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<AssetGroup>(
        'Asset group found',
        assetGroup,
      );
    } catch (ex) {
      const errorMessage = `Error finding asset groups for id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding asset group.',
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

      const query = getAnyOf(assetGroupId, 'asset_group_id');

      const assets = await this.assetRepository
        .createQueryBuilder('asset')
        .where(query)
        .getMany();

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
      const insert: Asset = {
        ...asset,
        assetGroupId: JSON.stringify(asset.assetGroupId ?? ''),
      };

      const res = await this.assetRepository.upsert(insert, ['assetId']);
      const newAsset = res.identifiers[0] as Asset;
      if (newAsset.assetGroupId) {
        try {
          const assetGroupsArray: number[] = JSON.parse(asset.assetGroupId);
          await this.assetGroupAssignRepository.insert(
            assetGroupsArray.map((group) => ({
              assetGroupId: group,
              assetId: newAsset.assetId,
            })),
          );
        } catch (error) {
          logger.error(
            `Error parsing assetGroupId for asset ${asset.assetId}: ${error}`,
          );
        }
      }
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
  async createAssetGroup(
    assetGroup: AssetGroup,
  ): Promise<ServiceResponse<Partial<AssetGroup> | null>> {
    try {
      const newGroup = await this.assetGroupRepository.upsert(assetGroup, [
        'assetGroupId',
      ]);
      const { assetGroupId } = newGroup.identifiers[0] as AssetGroup;
      return ServiceResponse.success<Partial<AssetGroup>>(
        'Asset group created',
        {
          assetGroupId,
        },
      );
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

  async assignAssetGroup(
    assetGroupId: number,
    assetId: number,
    isRemove = false,
  ): Promise<ServiceResponse<boolean>> {
    try {
      if (isRemove) {
        await this.assetGroupAssignRepository.delete({ assetGroupId, assetId });
        return ServiceResponse.success<boolean>(
          'Asset assignment removed',
          true,
        );
      }
      await this.assetGroupAssignRepository.insert({
        assetGroupId,
        assetId,
      });
      return ServiceResponse.success<boolean>('Asset assignment created', true);
    } catch (ex) {
      const errorMessage = `Error assigning Asset: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while assigning Asset.',
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getIoc(
    assetId: string,
    timeFrame: string,
  ): Promise<ServiceResponse<IndicatorLink[] | null>> {
    try {
      const alias = 'indicator_list';
      const queryBuilder = this.indicatorLinkRepository
        .createQueryBuilder(alias)
        .where(`${alias}.asset_id = :assetId`, { assetId });

      const timeCondition = getTimeFrameQuery(
        timeFrame as TimeFrames,
        alias,
        'createdAt',
      );
      if (timeCondition !== '1=1') {
        queryBuilder.andWhere(timeCondition);
      }

      const links = await queryBuilder.getMany();

      return ServiceResponse.success<IndicatorLink[]>('Found IOCs', links);
    } catch (ex) {
      const errorMessage = `Error finding IOCs: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding IOCs.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const assetService = new AssetService();
