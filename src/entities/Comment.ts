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
import { Indicator } from './Indicator';
import { Task } from './Task';

@Index('case_id', ['caseId'], {})
@Index('user_id', ['userId'], {})
@Index('ioc_id', ['iocId'], {})
@Index('task_id', ['taskId'], {})
@Entity('comment', { schema: 'AxisIR-DB' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'comment_id' })
  commentId: number;

  @Column('int', { name: 'case_id', nullable: true })
  caseId: number | null;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('int', { name: 'ioc_id', nullable: true })
  iocId: number | null;

  @Column('int', { name: 'task_id', nullable: true })
  taskId: number | null;

  @Column('varchar', { name: 'content', length: 200 })
  content: string;

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'edited_at', nullable: true })
  editedAt: Date | null;

  @ManyToOne(
    () => Incident,
    (incident) => incident.comments,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'case_id', referencedColumnName: 'caseId' }])
  case: Incident;

  @ManyToOne(
    () => User,
    (user) => user.comments,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;

  @ManyToOne(
    () => Indicator,
    (indicator) => indicator.comments,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'ioc_id', referencedColumnName: 'iocId' }])
  ioc: Indicator;

  @ManyToOne(
    () => Task,
    (task) => task.comments,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'task_id', referencedColumnName: 'taskId' }])
  task: Task;
}
