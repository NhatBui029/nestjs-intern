import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Member } from './member.entity';

export type RoleType = 'admin' | 'user';

@Entity('roles')
export class Role{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: RoleType

    @ManyToMany(()=>Member, (member)=> member.roles)
    members: Member[]

}