import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './Task';
import { User } from './User';

@Index('task_id', ['taskId'], {})
@Index('user_id', ['userId'], {})
@Entity('task_assign', { schema: 'AxisIR-DB' })
export class TaskAssign {
  @PrimaryGeneratedColumn({ type: 'int', name: 'task_assign_id' })
  taskAssignId: number;

  @Column('int', { name: 'task_id' })
  taskId: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  @ManyToOne(
    () => Task,
    (task) => task.taskAssigns,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'task_id', referencedColumnName: 'taskId' }])
  task: Task;

  @ManyToOne(
    () => User,
    (user) => user.taskAssigns,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;
}
