import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Entity, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Project } from './project.entity';
import { Ticket } from './ticket.entity';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    length: 1000,
    nullable: true
  })
  avatar: string;

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

  @ManyToMany(() => Project, (project) => project.members)
  projects?: Project[];

  @OneToMany(() => Ticket, (ticket) => ticket.assign)
  tickets?: Ticket[];

  @ManyToMany(()=>Role, (role)=> role.members)
  @JoinTable({name: 'member_role'})
  roles: Role[]
}
