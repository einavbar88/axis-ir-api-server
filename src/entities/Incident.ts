import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { Company } from './Company';
import { Report } from './Report';
import { Task } from './Task';
import { User } from '@/entities/User';

@Index('company_id', ['companyId'], {})
@Entity('incident', { schema: 'AxisIR-DB' })
export class Incident {
  @PrimaryGeneratedColumn({ type: 'int', name: 'case_id' })
  caseId: number;

  @Column('int', { name: 'company_id' })
  companyId: number;

  @ManyToOne(
    () => User,
    (user) => user.incident,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'assignee', referencedColumnName: 'userId' })
  assignee: User;

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

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

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
