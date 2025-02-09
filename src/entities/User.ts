import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { IncidentAssign } from './IncidentAssign';
import { Indicator } from './Indicator';
import { Log } from './Log';
import { Report } from './Report';
import { TaskAssign } from './TaskAssign';

@Index('username', ['username'], { unique: true })
@Index('email', ['email'], { unique: true })
@Entity('user', { schema: 'AxisIR-DB' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @Column('varchar', { name: 'username', unique: true, length: 32 })
  username: string;

  @Column('varchar', { name: 'email', unique: true, length: 100 })
  email: string;

  @Column('varchar', { name: 'password', length: 64 })
  password: string;

  @Column('tinyint', { name: 'is_active', nullable: true, width: 1 })
  isActive: boolean | null;

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

  @Column('varchar', { name: 'first_name', nullable: true, length: 30 })
  firstName: string | null;

  @Column('varchar', { name: 'last_name', nullable: true, length: 30 })
  lastName: string | null;

  @Column('varchar', { name: 'position', nullable: true, length: 30 })
  position: string | null;

  @OneToMany(
    () => Comment,
    (comment) => comment.user,
  )
  comments: Comment[];

  @OneToMany(
    () => IncidentAssign,
    (incidentAssign) => incidentAssign.user,
  )
  incidentAssigns: IncidentAssign[];

  @OneToMany(
    () => IncidentAssign,
    (incidentAssign) => incidentAssign.assignedBy2,
  )
  incidentAssigns2: IncidentAssign[];

  @OneToMany(
    () => Indicator,
    (indicator) => indicator.classifiedBy2,
  )
  indicators: Indicator[];

  @OneToMany(
    () => Log,
    (log) => log.user,
  )
  logs: Log[];

  @OneToMany(
    () => Report,
    (report) => report.createdBy2,
  )
  reports: Report[];

  @OneToMany(
    () => TaskAssign,
    (taskAssign) => taskAssign.user,
  )
  taskAssigns: TaskAssign[];
}
