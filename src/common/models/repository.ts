import {
  DataSource,
  type DataSourceOptions,
  type EntityTarget,
  type ObjectLiteral,
  type Repository,
} from 'typeorm';
import { env } from '@/common/utils/envConfig';
import { createDatabase } from 'typeorm-extension';
import { UserRole } from '@/entities/UserRole';
import { User } from '@/entities/User';
import { Company } from '@/entities/Company';
import { Contact } from '@/entities/Contact';
import { Report } from '@/entities/Report';
import { Comment } from '@/entities/Comment';
import { AssetGroup } from '@/entities/AssetGroup';
import { Asset } from '@/entities/Asset';
import { Indicator } from '@/entities/Indicator';
import { Incident } from '@/entities/Incident';
import { Task } from '@/entities/Task';
import { Log } from '@/entities/Log';
import { TokenWhitelist } from '@/entities/TokenWhitelist';
import { Role } from '@/entities/Role';
import { InvitedUser } from '@/entities/InvitedUser';
import { AssetGroupAssign } from '@/entities/AssetGroupAssign';
import { IndicatorLink } from '@/entities/IndicatorLink';

let repository: DataSource;

const initialize = async () => {
  const options: DataSourceOptions = {
    type: 'mysql',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    logging: true,
    migrations: ['./migrations/*.ts'],
    entities: [
      Asset,
      AssetGroup,
      AssetGroupAssign,
      Comment,
      Company,
      Contact,
      Incident,
      Indicator,
      IndicatorLink,
      InvitedUser,
      Log,
      Report,
      Role,
      Task,
      TokenWhitelist,
      User,
      UserRole,
    ],
  };
  await createDatabase({ options });
  repository = new DataSource(options);
  await repository.initialize();
};

const getRepository = async <T extends ObjectLiteral>(
  entity: EntityTarget<T>,
): Promise<Repository<T>> => {
  if (!repository) {
    await initialize();
  }
  return repository.getRepository(entity);
};

export { initialize, getRepository };
