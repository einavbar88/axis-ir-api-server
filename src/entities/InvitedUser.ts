import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('invited_user', { schema: 'AxisIR-DB' })
@Unique(['companyId', 'email'])
export class InvitedUser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'text', name: 'email' })
  email: string;

  @Column({ type: 'int', name: 'role_id' })
  roleId: number;

  @Column({ type: 'int', name: 'company_id' })
  companyId: number;

  @Column({ type: 'boolean', name: 'registered', default: false })
  registered: boolean;
}
