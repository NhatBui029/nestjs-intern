import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';

export type StatusType = 'TODO' | 'INPROGRESS' | 'DONE';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 120,
  })
  nhatdz: string;
}
