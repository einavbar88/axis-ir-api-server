import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index('user_id', ['userId'], {})
@Entity('log', { schema: 'AxisIR-DB' })
export class Log {
  @PrimaryGeneratedColumn({ type: 'int', name: 'log_id' })
  logId: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('varchar', { name: 'log_type', nullable: true, length: 50 })
  logType: string | null;

  @Column('varchar', { name: 'action', length: 255 })
  action: string;

  @Column('varchar', { name: 'details', nullable: true, length: 255 })
  details: string | null;

  @Column('datetime', { name: 'timestamp', nullable: true })
  timestamp: Date | null;

  @ManyToOne(
    () => User,
    (user) => user.logs,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;
}
