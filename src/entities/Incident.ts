import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { Company } from './Company';
import { IncidentAssign } from './IncidentAssign';
import { Report } from './Report';
import { Task } from './Task';

@Index('company_id', ['companyId'], {})
@Entity('incident', { schema: 'AxisIR-DB' })
export class Incident {
  @PrimaryGeneratedColumn({ type: 'int', name: 'case_id' })
  caseId: number;

  @Column('int', { name: 'company_id' })
  companyId: number;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  @Column('varchar', { name: 'status', nullable: true, length: 50 })
  status: string | null;

  @Column('int', { name: 'priority', nullable: true })
  priority: number | null;

  @Column('datetime', { name: 'opened_at', nullable: true })
  openedAt: Date | null;

  @Column('datetime', { name: 'closed_at', nullable: true })
  closedAt: Date | null;

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('varchar', { name: 'tlp', nullable: true, length: 10 })
  tlp: string | null;

  @OneToMany(
    () => Comment,
    (comment) => comment.case,
  )
  comments: Comment[];

  @ManyToOne(
    () => Company,
    (company) => company.incidents,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @OneToMany(
    () => IncidentAssign,
    (incidentAssign) => incidentAssign.case,
  )
  incidentAssigns: IncidentAssign[];

  @OneToMany(
    () => Report,
    (report) => report.case,
  )
  reports: Report[];

  @OneToMany(
    () => Task,
    (task) => task.case,
  )
  tasks: Task[];
}
