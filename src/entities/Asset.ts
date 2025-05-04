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
import { AssetGroup } from './AssetGroup';
import { Company } from './Company';
import { Task } from './Task';

@Index('asset_group_id', ['assetGroupId'], {})
@Index('company_id', ['companyId'], {})
@Index('parent_asset_id', ['parentAssetId'], {})
@Entity('asset', { schema: 'AxisIR-DB' })
export class Asset {
  @PrimaryGeneratedColumn({ type: 'int', name: 'asset_id' })
  assetId: number;

  @Column('varchar', { name: 'asset_group_id', nullable: true })
  assetGroupId: string;

  @Column('int', { name: 'company_id', nullable: true })
  companyId: number | null;

  @Column('int', { name: 'parent_asset_id', nullable: true })
  parentAssetId: number | null;

  @Column('int', { name: 'priority', nullable: true })
  priority: number | null;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'type', nullable: true, length: 50 })
  type: string | null;

  @Column('varchar', { name: 'operating_system', nullable: true, length: 50 })
  operatingSystem: string | null;

  @Column('varchar', { name: 'status', nullable: true, length: 50 })
  status: string | null;

  @Column('blob', { name: 'meta_data', nullable: true })
  metaData: Buffer | null;

  @Column('varchar', { name: 'tlp', nullable: true, length: 10 })
  tlp: string | null;

  @Column('datetime', { name: 'last_heartbeat', nullable: true })
  lastHeartbeat: Date | null;

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

  @ManyToOne(
    () => AssetGroup,
    (assetGroup) => assetGroup.assets,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([
    { name: 'asset_group_id', referencedColumnName: 'assetGroupId' },
  ])
  assetGroup: AssetGroup;

  @ManyToOne(
    () => Company,
    (company) => company.assets,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @ManyToOne(
    () => Asset,
    (asset) => asset.assets,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'parent_asset_id', referencedColumnName: 'assetId' }])
  parentAsset: Asset;

  @OneToMany(
    () => Asset,
    (asset) => asset.parentAsset,
  )
  assets: Asset[];

  @OneToMany(
    () => Task,
    (task) => task.asset,
  )
  tasks: Task[];
}
