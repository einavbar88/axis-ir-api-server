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
import { User } from './User';
import { Task } from './Task';

@Index('classified_by', ['classifiedBy'], {})
@Entity('indicator', { schema: 'AxisIR-DB' })
export class Indicator {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ioc_id' })
  iocId: number;

  @Column('varchar', { name: 'type', nullable: true, length: 50 })
  type: string | null;

  @Column('varchar', { name: 'value', length: 255 })
  value: string;

  @Column('varchar', { name: 'classification', nullable: true, length: 50 })
  classification: string | null;

  @Column('int', { name: 'priority', nullable: true })
  priority: number | null;

  @Column('int', { name: 'classified_by', nullable: true })
  classifiedBy: number | null;

  @Column('blob', { name: 'meta_data', nullable: true })
  metaData: Buffer | null;

  @Column('datetime', { name: 'detected_at', nullable: true })
  detectedAt: Date | null;

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
    (comment) => comment.ioc,
  )
  comments: Comment[];

  @ManyToOne(
    () => User,
    (user) => user.indicators,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'classified_by', referencedColumnName: 'userId' }])
  classifiedBy2: User;

  @OneToMany(
    () => Task,
    (task) => task.ioc,
  )
  tasks: Task[];
}
