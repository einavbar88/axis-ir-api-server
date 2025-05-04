import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('asset_group_assign', { schema: 'AxisIR-DB' })
export class AssetGroupAssign {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'asset_group_id' })
  assetGroupId: number;

  @Column({ type: 'int', name: 'asset_id' })
  assetId: number;
}
