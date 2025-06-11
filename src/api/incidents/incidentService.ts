import { In, type Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { Incident } from '@/entities/Incident';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';
import { getTimeFrameQuery, type TimeFrames } from '@/common/utils/queryHelper';
import { IndicatorLink } from '@/entities/IndicatorLink';
import { Indicator } from '@/entities/Indicator';
import { Report } from '@/entities/Report';

type IncidentResponse = Partial<Incident> & {
  assigneeName?: string;
  reports?: Report[];
};
type IOC = IndicatorLink & Partial<Indicator>;

export class IncidentService {
  private incidentRepository!: Repository<Incident>;
  private indicatorLinkRepository!: Repository<IndicatorLink>;
  private indicatorRepository!: Repository<Indicator>;
  private reportRepository!: Repository<Report>;

  async init() {
    this.incidentRepository = await getRepository(Incident);
    this.indicatorLinkRepository = await getRepository(IndicatorLink);
    this.indicatorRepository = await getRepository(Indicator);
    this.reportRepository = await getRepository(Report);
  }

  async findAll(
    companyId: number,
    timeFrame: TimeFrames,
  ): Promise<ServiceResponse<IncidentResponse[] | null>> {
    const timeFrameQuery = getTimeFrameQuery(timeFrame, 'incident', 'openedAt');

    try {
      const incidents = await this.incidentRepository
        .createQueryBuilder('incident')
        .leftJoinAndSelect('incident.assignee', 'user')
        .select(['incident', 'user.username', 'user.userId'])
        .where('incident.companyId = :companyId', { companyId })
        .andWhere(timeFrameQuery)
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

      const reports = await this.reportRepository.find({
        where: { caseId: id },
      });

      return ServiceResponse.success<IncidentResponse>('Incident found', {
        ...incident,
        assignee: incident.assignee?.userId as any,
        assigneeName: incident.assignee?.username,
        reports,
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
      const closedAt = new Date();
      const _incident = {
        ...incident,
        closedAt: incident.status === 'CLOSED' ? closedAt : null,
      };
      const newIncident = await this.incidentRepository.save(_incident);
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
      const { caseId, status, closedAt: _closedAt } = incident;
      if (!caseId) {
        return ServiceResponse.failure(
          'Incident caseId is required',
          null,
          StatusCodes.BAD_REQUEST,
        );
      }
      const closedAt = _closedAt ?? new Date();
      const _incident = {
        ...incident,
        closedAt: status === 'CLOSED' ? closedAt : null,
      };
      const update = await this.incidentRepository.update(caseId, _incident);
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

  async getIoc(
    caseIds: string[],
    timeFrame: string,
  ): Promise<ServiceResponse<IOC[] | null>> {
    try {
      const alias = 'indicator_list';

      const queryBuilder = this.indicatorLinkRepository
        .createQueryBuilder(alias)
        .where(`${alias}.case_id IN (:...caseIds)`, { caseIds });

      const timeCondition = getTimeFrameQuery(
        timeFrame as TimeFrames,
        alias,
        'createdAt',
      );
      if (timeCondition !== '1=1') {
        queryBuilder.andWhere(timeCondition);
      }

      const links = await queryBuilder.getMany();
      const indicators = await this.indicatorRepository.find({
        where: { iocId: In(links.map((l) => l.iocId)) },
      });

      const ret = links.map((link) => ({
        ...link,
        ...(indicators.find((i) => i.iocId === link.iocId) || {}),
      }));

      return ServiceResponse.success<IOC[]>(
        'Found infected assets',
        ret as IOC[],
      );
    } catch (ex) {
      const errorMessage = `Error finding infected assets: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding infected asset.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateReports(id: string) {
    try {
      const reportServer = 'http://localhost:8000/GenerateReport';
      await fetch(reportServer, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ case_id: id }),
      });
      return ServiceResponse.success('Generating report', null);
    } catch (ex) {
      const errorMessage = `Error generating report: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while generating report.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSLAs() {
    try {
      const closedIncidents = await this.incidentRepository.find({
        where: { status: 'CLOSED' },
      });
    } catch (ex) {
      const errorMessage = `Error getting sla: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while getting sla.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const incidentService = new IncidentService();
