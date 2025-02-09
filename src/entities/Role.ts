import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role', { schema: 'AxisIR-DB' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', name: 'role_id' })
  roleId: number;

  @Column('varchar', { name: 'name', length: 15 })
  name: string;
}
