import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Incident } from './Incident';
import { User } from './User';

@Index('case_id', ['caseId'], {})
@Index('user_id', ['userId'], {})
@Index('assigned_by', ['assignedBy'], {})
@Entity('incident_assign', { schema: 'AxisIR-DB' })
export class IncidentAssign {
  @PrimaryGeneratedColumn({ type: 'int', name: 'assign_id' })
  assignId: number;

  @Column('int', { name: 'case_id' })
  caseId: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('int', { name: 'assigned_by', nullable: true })
  assignedBy: number | null;

  @Column('datetime', { name: 'assigned_at', nullable: true })
  assignedAt: Date | null;

  @ManyToOne(
    () => Incident,
    (incident) => incident.incidentAssigns,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'case_id', referencedColumnName: 'caseId' }])
  case: Incident;

  @ManyToOne(
    () => User,
    (user) => user.incidentAssigns,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;

  @ManyToOne(
    () => User,
    (user) => user.incidentAssigns2,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'assigned_by', referencedColumnName: 'userId' }])
  assignedBy2: User;
}
