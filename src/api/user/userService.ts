import type { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { User } from '@/entities/User';
import { UserRole } from '@/entities/UserRole';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { getRepository } from '@/common/models/repository';
import { generateToken } from '@/common/utils/jwt';
import { TokenWhitelist } from '@/entities/TokenWhitelist';
import { Role } from '@/entities/Role';
import { InvitedUser } from '@/entities/InvitedUser';

type PartialUser = Partial<User> & { roles?: UserRole[] };
type RoleValue = { label: string; value: number };

export class UserService {
  private userRepository!: Repository<User>;
  private roleRepository!: Repository<Role>;
  private userRoleRepository!: Repository<UserRole>;
  private invitedUserRoleRepository!: Repository<InvitedUser>;
  private tokenWhitelistRepository!: Repository<TokenWhitelist>;

  async init() {
    this.userRepository = await getRepository(User);
    this.userRoleRepository = await getRepository(UserRole);
    this.invitedUserRoleRepository = await getRepository(InvitedUser);
    this.roleRepository = await getRepository(Role);
    this.tokenWhitelistRepository = await getRepository(TokenWhitelist);
  }

  async findById(id: number): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findOne({
        where: { userId: id },
      });
      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<User>('User found', user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    user: User,
  ): Promise<ServiceResponse<{ user: PartialUser; token: string } | null>> {
    try {
      const password = bcrypt.hashSync(user.password, 10);
      const newUser = await this.userRepository.save({ ...user, password });
      await this.attachInvitations(newUser);
      return this.login(newUser.username, user.password);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating user.',
        this.getCreateErrorReason((ex as Error).message) as any,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async attachInvitations(user: User): Promise<void> {
    const invitations = await this.invitedUserRoleRepository.find({
      where: { email: user.email },
    });
    for await (const invitation of invitations) {
      await this.userRoleRepository.insert({
        companyId: invitation.companyId,
        userId: user.userId,
        roleId: invitation.roleId,
      });
      await this.invitedUserRoleRepository.update(invitation, {
        registered: true,
      });
    }
  }

  async updateUserDetails(
    id: number,
    user: User,
  ): Promise<ServiceResponse<User | null>> {
    try {
      const userToUpdate = await this.userRepository.findOne({
        where: { userId: id },
      });
      if (!userToUpdate) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      if (user.password) {
        user.password = bcrypt.hashSync(user.password, 10);
      }

      const updatedUser = await this.userRepository.save({
        ...userToUpdate,
        ...user,
      });
      return ServiceResponse.success<User>('User updated', updatedUser);
    } catch (ex) {
      const errorMessage = `Error updating user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    username: string,
    password: string,
  ): Promise<ServiceResponse<{ user: PartialUser; token: string } | null>> {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return ServiceResponse.failure(
          'Invalid username or password',
          null,
          StatusCodes.UNAUTHORIZED,
        );
      }
      const userRoles = await this.userRoleRepository.find({
        where: { userId: user.userId },
      });

      const token = generateToken({
        userId: user.userId,
        username: user.username,
      });
      await this.tokenWhitelistRepository.save({ token, userId: user.userId });
      return ServiceResponse.success<{ user: PartialUser; token: string }>(
        'User found',
        {
          user: {
            userId: user.userId,
            username: user.username,
            roles: userRoles,
          },
          token,
        },
      );
    } catch (ex) {
      const errorMessage = `Error finding user with username ${username}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async tokenLogin(
    token: string,
  ): Promise<ServiceResponse<PartialUser | null>> {
    try {
      const tokenWhitelist = await this.tokenWhitelistRepository.findOne({
        where: { token },
      });
      if (!tokenWhitelist) {
        return ServiceResponse.failure(
          'Invalid token',
          null,
          StatusCodes.UNAUTHORIZED,
        );
      }
      const user = await this.userRepository.findOne({
        where: { userId: tokenWhitelist.userId },
      });

      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      const userRoles = await this.userRoleRepository.find({
        where: { userId: user.userId },
      });
      return ServiceResponse.success('User found', {
        userId: user.userId,
        username: user.username,
        roles: userRoles,
      });
    } catch (e) {
      return ServiceResponse.failure(
        'An error occurred while finding token.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async revokeToken(token: string): Promise<ServiceResponse<string | null>> {
    try {
      const toDelete = await this.tokenWhitelistRepository.findOne({
        where: { token },
      });
      if (toDelete) await this.tokenWhitelistRepository.delete(toDelete.id);
      return ServiceResponse.success<string>('Token revoked', 'Token revoked');
    } catch (ex) {
      const errorMessage = `Error revoking token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.success(
        'An error occurred while revoking token.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRoles(): Promise<ServiceResponse<{ roles: RoleValue[] } | null>> {
    try {
      const roles = await this.roleRepository.find();
      const roleValues: RoleValue[] = roles.map((role) => ({
        value: role.roleId,
        label: role.name,
      }));
      return ServiceResponse.success<{ roles: RoleValue[] }>('Roles', {
        roles: roleValues,
      });
    } catch (ex) {
      const errorMessage = `Error getting roles: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.success(
        'An error occurred while getting roles.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async inviteUser(
    email: string,
    roleId: number,
    companyId: number,
  ): Promise<ServiceResponse> {
    try {
      const existing = await this.userRepository.findOne({ where: { email } });

      const res = existing
        ? await this.userRoleRepository.insert({
            roleId,
            userId: existing.userId,
            companyId,
          })
        : await this.invitedUserRoleRepository.insert({
            companyId,
            roleId,
            email,
          });

      console.log(res);
      return ServiceResponse.success('Invited!', null);
    } catch (ex) {
      const errorMessage = `Error getting roles: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.success(
        'An error occurred while getting roles.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getCreateErrorReason(message: string): {
    msg: string;
    field: string;
  } {
    let msg = 'An error occurred while creating user.';
    let field = '';
    if (message.includes('username')) {
      msg = 'Username already exists';
      field = 'username';
    }
    if (message.includes('email')) {
      msg = 'Email already exists';
      field = 'email';
    }
    return { msg, field };
  }
}

export const userService = new UserService();
