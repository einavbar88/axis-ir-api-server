import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from './Asset';
import { AssetGroup } from './AssetGroup';
import { Contact } from './Contact';
import { Incident } from './Incident';
import { Report } from './Report';

@Index('cin', ['cin'], { unique: true })
@Entity('company', { schema: 'AxisIR-DB' })
export class Company {
  @PrimaryGeneratedColumn({ type: 'int', name: 'company_id' })
  companyId: number;

  @Column('varchar', { name: 'cin', unique: true, length: 255 })
  cin: string;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'industry', nullable: true, length: 255 })
  industry: string | null;

  @Column('varchar', { name: 'address', nullable: true, length: 255 })
  address: string | null;

  @Column('varchar', { name: 'primary_email', length: 255 })
  primaryEmail: string;

  @Column('varchar', { name: 'primary_phone', nullable: true, length: 255 })
  primaryPhone: string | null;

  @Column('tinyint', { name: 'is_active', nullable: true, width: 1 })
  isActive: boolean | null;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

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

  @OneToMany(
    () => Asset,
    (asset) => asset.company,
  )
  assets: Asset[];

  @OneToMany(
    () => AssetGroup,
    (assetGroup) => assetGroup.company,
  )
  assetGroups: AssetGroup[];

  @OneToMany(
    () => Contact,
    (contact) => contact.company,
  )
  contacts: Contact[];

  @OneToMany(
    () => Incident,
    (incident) => incident.company,
  )
  incidents: Incident[];

  @OneToMany(
    () => Report,
    (report) => report.company,
  )
  reports: Report[];
}
