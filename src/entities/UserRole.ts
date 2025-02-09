import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_role', { schema: 'AxisIR-DB' })
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'role_id' })
  roleId: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'int', name: 'company_id' })
  companyId: number;
}
