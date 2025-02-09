import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/entities/User';

@Entity('token_whitelist', { schema: 'AxisIR-DB' })
export class TokenWhitelist {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'token' })
  token: string;

  @Column('int', { name: 'user_id' })
  userId: number;

  // Add the user relationship
  @ManyToOne(
    () => User,
    (user) => user.userId,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;
}
