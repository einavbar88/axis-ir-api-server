import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from './Asset';
import { Company } from './Company';
import { Task } from './Task';

@Index('company_id', ['companyId'], {})
@Entity('asset_group', { schema: 'AxisIR-DB' })
export class AssetGroup {
  @PrimaryGeneratedColumn({ type: 'int', name: 'asset_group_id' })
  assetGroupId: number;

  @Column('int', { name: 'company_id' })
  companyId: number;

  @Column('varchar', { name: 'title', length: 50 })
  title: string;

  @Column('varchar', { name: 'description', nullable: true, length: 100 })
  description: string | null;

  @OneToMany(
    () => Asset,
    (asset) => asset.assetGroup,
  )
  assets: Asset[];

  @ManyToOne(
    () => Company,
    (company) => company.assetGroups,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @OneToMany(
    () => Task,
    (task) => task.assetGroup,
  )
  tasks: Task[];
}
