import { Ticket } from './../../entities/ticket.entity';
import { Repository, In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketDTO } from './dto/ticket.dto';
import { List } from '../member/dto/setTicket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketReposioty: Repository<Ticket>,
  ) {}

  async addTicket(ticket: TicketDTO): Promise<Object> {
    try {
      const newTicket = await this.ticketReposioty.save({ ...ticket });
      return { status: true, message: `id: ${newTicket.id}` };
    } catch (error) {
      return { status: false, message: error };
    }
  }

  async editTicket(id: number, info: TicketDTO): Promise<Object> {
    try {
      const newTicket = await this.ticketReposioty.update(
        { id: id },
        { ...info },
      );
      return { status: true, message: `Update successfully for  id: ${id}` };
    } catch (error) {
      return { status: false, message: error };
    }
  }

  async getTickets(condition: TicketDTO): Promise<Ticket[]> {
    const allTicket = await this.ticketReposioty.find({
      where: condition
    });
    return allTicket;
  }
  
  async getTicketsByIDS(ids : number[]): Promise<Ticket[]>{
    return await this.ticketReposioty.findBy({
      id: In(ids)
    })
  }
}
