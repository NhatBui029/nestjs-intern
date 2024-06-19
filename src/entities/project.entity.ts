import { ManyToMany, JoinTable, OneToMany } from 'typeorm';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index
} from 'typeorm';

import { Entity } from 'typeorm';
import { Member } from './member.entity';
import { Ticket } from './ticket.entity';

export type ProjectType = 'LABOUR' | 'FIX_PRICE' | 'MAINTENANCE';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) 
  name: string;

  @Column({ nullable: true })
  @Index()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ['LABOUR', 'FIX_PRICE', 'MAINTENANCE'], 
  })
  @Index()
  projectType: ProjectType;

  @Column({ nullable: true })
  profit: number;

  @CreateDateColumn({ name: 'created_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToMany(() => Member, (member) => member.projects)
  @JoinTable({name: 'project_member'})
  members: Project[];

  @OneToMany(() => Ticket, (ticket) => ticket.project)
  tickets: Ticket[];
}
