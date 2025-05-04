import type { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { Incident } from '@/entities/Incident';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';

export class IncidentService {
  private incidentRepository!: Repository<Incident>;

  async init() {
    this.incidentRepository = await getRepository(Incident);
  }

  async findAll(): Promise<ServiceResponse<Incident[] | null>> {
    try {
      const incidents = await this.incidentRepository.find();
      if (!incidents || incidents.length === 0) {
        return ServiceResponse.failure(
          'No incidents found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<Incident[]>('Incident found', incidents);
    } catch (ex) {
      const errorMessage = `Error finding all incidents: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving incidents.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Incident | null>> {
    try {
      const incident = await this.incidentRepository.findOne({
        where: { caseId: id },
      });
      if (!incident) {
        return ServiceResponse.failure(
          'Incident not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<Incident>('Incident found', incident);
    } catch (ex) {
      const errorMessage = `Error finding incident with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding incident.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(incident: Incident): Promise<ServiceResponse<Incident | null>> {
    try {
      const newIncident = await this.incidentRepository.save(incident);
      return ServiceResponse.success<Incident>('Incident created', newIncident);
    } catch (ex) {
      const errorMessage = `Error creating incident: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating incident.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const incidentService = new IncidentService();
