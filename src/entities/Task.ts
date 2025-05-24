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
import { Incident } from './Incident';
import { Indicator } from './Indicator';
import { Asset } from './Asset';
import { AssetGroup } from './AssetGroup';

@Index('case_id', ['caseId'], {})
@Index('ioc_id', ['iocId'], {})
@Index('asset_id', ['assetId'], {})
@Index('asset_group_id', ['assetGroupId'], {})
@Entity('task', { schema: 'AxisIR-DB' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'int', name: 'task_id' })
  taskId: number;

  @Column('int', { name: 'case_id', nullable: true })
  caseId: number | null;

  @Column('text', { name: 'ioc_id', nullable: true })
  iocId: string | null;

  @Column('int', { name: 'assignee', nullable: true })
  assignee: number | null;

  @Column('text', { name: 'asset_id', nullable: true })
  assetId: string | null;

  @Column('text', { name: 'asset_group_id', nullable: true })
  assetGroupId: string | null;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  @Column('int', { name: 'priority', nullable: true })
  priority: number | null;

  @Column('varchar', { name: 'status', nullable: true, length: 50 })
  status: string | null;

  @Column('datetime', { name: 'due_date', nullable: true })
  dueDate: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(
    () => Comment,
    (comment) => comment.task,
  )
  comments: Comment[];

  @ManyToOne(
    () => Incident,
    (incident) => incident.tasks,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'case_id', referencedColumnName: 'caseId' }])
  case: Incident;

  @ManyToOne(
    () => Indicator,
    (indicator) => indicator.tasks,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'ioc_id', referencedColumnName: 'iocId' }])
  ioc: Indicator;

  @ManyToOne(
    () => Asset,
    (asset) => asset.tasks,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'asset_id', referencedColumnName: 'assetId' }])
  asset: Asset;

  @ManyToOne(
    () => AssetGroup,
    (assetGroup) => assetGroup.tasks,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([
    { name: 'asset_group_id', referencedColumnName: 'assetGroupId' },
  ])
  assetGroup: AssetGroup;
}
