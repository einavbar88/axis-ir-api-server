import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('user_role', { schema: 'AxisIR-DB' })
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'int', name: 'role_id' })
  roleId: number;

  @Column('varchar', { name: 'role_name', length: 50 })
  roleName: string;

  @Column('varchar', { name: 'role_description', nullable: true, length: 100 })
  roleDescription: string | null;

  @Column('tinyint', { name: 'isRoleActive', nullable: true, width: 1 })
  isRoleActive: boolean | null;

  @Column('tinyint', { name: 'isCompanyMember', nullable: true, width: 1 })
  isCompanyMember: boolean | null;

  @Column('tinyint', { name: 'isOperator', nullable: true, width: 1 })
  isOperator: boolean | null;

  @Column('tinyint', { name: 'isManager', nullable: true, width: 1 })
  isManager: boolean | null;

  @Column('tinyint', { name: 'isAdmin', nullable: true, width: 1 })
  isAdmin: boolean | null;

  @OneToMany(
    () => User,
    (user) => user.role,
  )
  users: User[];
}
