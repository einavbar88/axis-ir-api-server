import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './Company';

@Index('company_id', ['companyId'], {})
@Entity('contact', { schema: 'AxisIR-DB' })
export class Contact {
  @PrimaryGeneratedColumn({ type: 'int', name: 'contact_id' })
  contactId: number;

  @Column('int', { name: 'company_id' })
  companyId: number;

  @Column('varchar', { name: 'email', nullable: true, length: 255 })
  email: string | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 255 })
  phone: string | null;

  @Column('varchar', { name: 'first_name', nullable: true, length: 255 })
  firstName: string | null;

  @Column('varchar', { name: 'last_name', nullable: true, length: 255 })
  lastName: string | null;

  @Column('varchar', { name: 'comm_proto', nullable: true, length: 255 })
  commProto: string | null;

  @Column('varchar', { name: 'position', nullable: true, length: 30 })
  position: string | null;

  @Column('varchar', { name: 'note', nullable: true, length: 200 })
  note: string | null;

  @Column('tinyint', { name: 'is_active', nullable: true, width: 1 })
  isActive: boolean | null;

  @ManyToOne(
    () => Company,
    (company) => company.contacts,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;
}
