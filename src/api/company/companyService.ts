import { In, type Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { Company } from '@/entities/Company';
import { UserRole } from '@/entities/UserRole';
import { User } from '@/entities/User';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';
import { Roles } from '@/common/enums/Roles';

export class CompanyService {
  private companyRepository!: Repository<Company>;
  private userRoleRepository!: Repository<UserRole>;
  private userRepository!: Repository<User>;

  async init() {
    this.companyRepository = await getRepository(Company);
    this.userRoleRepository = await getRepository(UserRole);
    this.userRepository = await getRepository(User);
  }

  async findByUserId(
    userId: number,
  ): Promise<ServiceResponse<Company[] | null>> {
    try {
      const roles = await this.userRoleRepository.find({
        where: { userId },
      });
      const companiesIds = roles.map((role) => role.companyId);
      console.log(companiesIds);
      const companies = await this.companyRepository.find({
        where: { companyId: In([...companiesIds]) },
      });
      if (!companies || companies.length === 0) {
        return ServiceResponse.failure(
          'No Companys found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<Company[]>('Company found', companies);
    } catch (ex) {
      const errorMessage = `Error finding all Companys: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving Companys.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Company | null>> {
    try {
      const company = await this.companyRepository.findOne({
        where: { companyId: id },
      });
      if (!company) {
        return ServiceResponse.failure(
          'Company not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<Company>('Company found', company);
    } catch (ex) {
      const errorMessage = `Error finding Company with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding Company.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async assignUserRoleToCompany(
    actorId: number,
    companyId: number,
    email: string,
    roleId: number,
  ): Promise<ServiceResponse> {
    try {
      if (!roleId || !email || !companyId) {
        return ServiceResponse.failure(
          'Company id, user email or role id is missing',
          null,
          StatusCodes.BAD_REQUEST,
        );
      }
      const actor = await this.userRoleRepository.findOne({
        where: { userId: actorId, companyId },
      });

      if (!actor || actor.roleId !== Roles.ADMIN) {
        return ServiceResponse.failure(
          'Only Admin can assign roles',
          null,
          StatusCodes.FORBIDDEN,
        );
      }
      const company = await this.companyRepository.findOne({
        where: { companyId },
      });
      if (!company) {
        return ServiceResponse.failure(
          'Company not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      const role = await this.userRoleRepository.save({
        companyId,
        userId: user.userId,
        roleId,
      });
      return ServiceResponse.success('Assigned user to company', null);
    } catch (ex) {
      const errorMessage = `Error assigning user ${email} to Company with id ${companyId}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding Company.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    company: Company,
    userId: number,
  ): Promise<ServiceResponse<Partial<Company> | null>> {
    try {
      const newCompany = await this.companyRepository.save(company);
      const { companyId, name } = newCompany;
      const roleId = Roles.ADMIN;
      await this.userRoleRepository.save({ companyId, userId, roleId });
      return ServiceResponse.success<Partial<Company>>('Company created', {
        companyId,
        name,
      });
    } catch (ex) {
      const errorMessage = `Error creating Company: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating Company.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const companyService = new CompanyService();
