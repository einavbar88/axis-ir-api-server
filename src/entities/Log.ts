import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({
    name: 'timestamp',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date | null;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

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
