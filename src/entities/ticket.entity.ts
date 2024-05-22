import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { Member } from './member.entity';

export type StatusType = "TODO" | "INPROGRESS" | "DONE"

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 120,
  })
  title: string;

  @Column({
    length: 5000,
  })
  content: string;

  @Column()
  deadline: Date;

  @Column({
    type: 'enum',
    enum: ["TODO" , "INPROGRESS" , "DONE"],
    default: "TODO"
  })
  status: StatusType

  @ManyToOne(() => Member, (member) => member.tickets)
  @JoinColumn({name: 'memberId'})
  assign: Member;

  @CreateDateColumn({
    name: 'created_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;

  @ManyToOne(() => Project, (project) => project.tickets)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
