import type { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { Report } from '@/entities/Report';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';

export class ReportService {
  private reportRepository!: Repository<Report>;

  async init() {
    this.reportRepository = await getRepository(Report);
  }

  async findAll(): Promise<ServiceResponse<Report[] | null>> {
    try {
      const reports = await this.reportRepository.find();
      if (!reports || reports.length === 0) {
        return ServiceResponse.failure(
          'No reports found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<Report[]>('Report found', reports);
    } catch (ex) {
      const errorMessage = `Error finding all reports: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving reports.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Report | null>> {
    try {
      const report = await this.reportRepository.findOne({
        where: { reportId: id },
      });
      if (!report) {
        return ServiceResponse.failure(
          'Report not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<Report>('Report found', report);
    } catch (ex) {
      const errorMessage = `Error finding report with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding report.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(report: Report): Promise<ServiceResponse<Report | null>> {
    try {
      const newReport = await this.reportRepository.save(report);
      return ServiceResponse.success<Report>('Report created', newReport);
    } catch (ex) {
      const errorMessage = `Error creating report: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating report.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const reportService = new ReportService();
