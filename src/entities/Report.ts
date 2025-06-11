import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './Company';
import { Incident } from './Incident';
import { User } from './User';

@Index('company_id', ['companyId'], {})
@Index('case_id', ['caseId'], {})
@Index('created_by', ['createdBy'], {})
@Entity('report', { schema: 'AxisIR-DB' })
export class Report {
  @PrimaryGeneratedColumn({ type: 'int', name: 'report_id' })
  reportId: number;

  @Column('int', { name: 'company_id' })
  companyId: number;

  @Column('int', { name: 'case_id', nullable: true })
  caseId: number | null;

  @Column('int', { name: 'created_by', nullable: true })
  createdBy: number | null;

  @Column('varchar', { name: 'title', length: 30 })
  title: string;

  @Column('varchar', { name: 'description', nullable: true, length: 200 })
  description: string | null;

  @Column('varchar', {
    name: 'report_file_s3_path',
    nullable: true,
    length: 255,
  })
  s3Path: string | null;

  @Column('datetime', { name: 'generated_at', nullable: true })
  generatedAt: Date | null;

  @Column('tinyint', { name: 'was_sent', nullable: true, width: 1 })
  wasSent: boolean | null;

  @Column('varchar', { name: 'tlp', nullable: true, length: 10 })
  tlp: string | null;

  @ManyToOne(
    () => Company,
    (company) => company.reports,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @ManyToOne(
    () => Incident,
    (incident) => incident.reports,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'case_id', referencedColumnName: 'caseId' }])
  case: Incident;

  @ManyToOne(
    () => User,
    (user) => user.reports,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'userId' }])
  createdBy2: User;
}
