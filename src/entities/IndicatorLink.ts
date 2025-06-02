import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('indicator_link')
export class IndicatorLink {
  @PrimaryGeneratedColumn({ name: 'link_id' })
  linkId: number;

  @Column({ name: 'ioc_id', type: 'int' })
  iocId: number;

  @Column({ name: 'case_id', type: 'int' })
  caseId: number;

  @Column({ name: 'asset_id', type: 'int' })
  assetId: number;

  @Column({ name: 'link_type', type: 'varchar', length: 50 })
  linkType: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ name: 'linked_by', type: 'int' })
  linkedBy: number;

  @Column({ name: 'meta_data', type: 'longtext', nullable: true })
  metaData?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  tlp?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updatedAt?: Date;

  @Column({ name: 'attack_phase', type: 'text', nullable: true })
  attackPhase?: string;

  @Column({ type: 'text', nullable: true })
  confidence?: string;
}
