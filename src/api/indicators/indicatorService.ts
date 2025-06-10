import type { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { Indicator } from '@/entities/Indicator';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';
import { getTimeFrameQuery, type TimeFrames } from '@/common/utils/queryHelper';
import type { CreateIndicatorDto } from './dto/CreateIndicator.dto';
import { IndicatorLink } from '@/entities/IndicatorLink';

type IndicatorResponse = Partial<Indicator>;

class IndicatorService {
  private indicatorRepository!: Repository<Indicator>;
  private indicatorLinkRepository!: Repository<IndicatorLink>;

  async init() {
    this.indicatorRepository = await getRepository(Indicator);
    this.indicatorLinkRepository = await getRepository(IndicatorLink);
  }

  async findAll(
    timeFrame: TimeFrames,
  ): Promise<ServiceResponse<IndicatorResponse[] | null>> {
    const timeFrameQuery = getTimeFrameQuery(
      timeFrame,
      'indicator',
      'createdAt',
    );

    try {
      const indicators = await this.indicatorRepository
        .createQueryBuilder('indicator')
        .select(['indicator'])
        .where(timeFrameQuery)
        .getMany();

      if (!indicators || indicators.length === 0) {
        return ServiceResponse.failure(
          'No indicators found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      return ServiceResponse.success<IndicatorResponse[]>(
        'Indicators found',
        indicators,
      );
    } catch (ex) {
      const errorMessage = `Error finding all indicators: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving indicators.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(
    id: number,
  ): Promise<ServiceResponse<IndicatorResponse | null>> {
    try {
      const indicator = await this.indicatorRepository.findOne({
        where: { iocId: id },
      });

      if (!indicator) {
        return ServiceResponse.failure(
          'Indicator not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      return ServiceResponse.success<IndicatorResponse>(
        'Indicator found',
        indicator,
      );
    } catch (ex) {
      const errorMessage = `Error finding indicator by id: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving the indicator.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    indicatorDto: CreateIndicatorDto,
  ): Promise<ServiceResponse<IndicatorResponse | null>> {
    try {
      logger.info(indicatorDto);

      const indicator = this.indicatorRepository.create({
        value: indicatorDto.value,
        type: indicatorDto.type,
        classification: indicatorDto.classification,
        priority: indicatorDto.priority,
        classifiedBy: indicatorDto.classifiedBy,
        detectedAt: indicatorDto.detectedAt,
        tlp: indicatorDto.tlp,
      });

      const savedIndicator = await this.indicatorRepository.save(indicator);

      const link = this.indicatorLinkRepository.create({
        iocId: savedIndicator.iocId,
        caseId: indicatorDto.caseId,
        assetId: indicatorDto.assetId,
        linkType: indicatorDto.linkType,
        value: indicatorDto.value,
        linkedBy: indicatorDto.classifiedBy,
        tlp: indicatorDto.tlp,
        attackPhase: indicatorDto.attackPhase,
        confidence: indicatorDto.confidence,
      });

      await this.indicatorLinkRepository.save(link);

      return ServiceResponse.success<IndicatorResponse>(
        'Indicator created successfully',
        savedIndicator,
      );
    } catch (ex) {
      const errorMessage = `Error creating indicator: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating the indicator.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    indicatorDto: Partial<CreateIndicatorDto> & { ioc_id: number },
  ): Promise<ServiceResponse<IndicatorResponse | null>> {
    try {
      const indicator = await this.indicatorRepository.findOne({
        where: { iocId: indicatorDto.ioc_id },
      });

      if (!indicator) {
        return ServiceResponse.failure(
          'Indicator not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      const updatedIndicator = await this.indicatorRepository.save({
        ...indicator,
        ...indicatorDto,
      });

      return ServiceResponse.success<IndicatorResponse>(
        'Indicator updated successfully',
        updatedIndicator,
      );
    } catch (ex) {
      const errorMessage = `Error updating indicator: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating the indicator.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean | null>> {
    try {
      const link = await this.indicatorLinkRepository.findOne({
        where: { iocId: id },
      });

      if (!link) {
        return ServiceResponse.failure(
          'No indicator links found for this indicator',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      await this.indicatorLinkRepository.remove(link);

      return ServiceResponse.success<boolean>(
        'Indicator links deleted successfully',
        true,
      );
    } catch (ex) {
      const errorMessage = `Error deleting indicator links: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while deleting the indicator links.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const indicatorService = new IndicatorService();
