import type { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { Incident } from '@/entities/Incident';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';

type IncidentResponse = Partial<Incident> & {
  assigneeName?: string;
};

export class IncidentService {
  private incidentRepository!: Repository<Incident>;

  async init() {
    this.incidentRepository = await getRepository(Incident);
  }

  async findAll(
    companyId: number,
  ): Promise<ServiceResponse<IncidentResponse[] | null>> {
    try {
      const incidents = await this.incidentRepository
        .createQueryBuilder('incident')
        .leftJoinAndSelect('incident.assignee', 'user')
        .select(['incident', 'user.username'])
        .where('incident.companyId = :companyId', { companyId })
        .getMany();

      if (!incidents || incidents.length === 0) {
        return ServiceResponse.failure(
          'No incidents found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      const incidentsWithAssignee: IncidentResponse[] = incidents.map(
        (incident) => ({
          ...incident,
          assignee: incident.assignee?.userId as any,
          assigneeName: incident.assignee?.username,
        }),
      );

      return ServiceResponse.success<IncidentResponse[]>(
        'Incident found',
        incidentsWithAssignee,
      );
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

  async findById(
    id: number,
  ): Promise<ServiceResponse<IncidentResponse | null>> {
    try {
      const incident = await this.incidentRepository
        .createQueryBuilder('incident')
        .leftJoinAndSelect('incident.assignee', 'user')
        .select(['incident', 'user.userId', 'user.username'])
        .where('incident.caseId = :caseId', { caseId: id })
        .getOne();

      if (!incident) {
        return ServiceResponse.failure(
          'Incident not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      return ServiceResponse.success<IncidentResponse>('Incident found', {
        ...incident,
        assignee: incident.assignee?.userId as any,
        assigneeName: incident.assignee?.username,
      });
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

  async create(
    incident: Incident,
  ): Promise<ServiceResponse<IncidentResponse | null>> {
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

  async update(
    incident: Partial<Incident>,
  ): Promise<ServiceResponse<Partial<Incident> | null>> {
    try {
      const { caseId } = incident;
      if (!caseId) {
        return ServiceResponse.failure(
          'Incident caseId is required',
          null,
          StatusCodes.BAD_REQUEST,
        );
      }
      const update = await this.incidentRepository.update(caseId, incident);
      return ServiceResponse.success<Partial<Incident>>(
        'Incident updated',
        update.raw,
      );
    } catch (ex) {
      const errorMessage = `Error updating incident: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating incident.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const incidentService = new IncidentService();
