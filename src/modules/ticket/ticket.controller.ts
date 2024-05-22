import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketDTO } from './dto/ticket.dto';
import { Ticket } from 'src/entities/ticket.entity';
import { ProjectService } from '../project/project.service';
import { Project } from 'src/entities/project.entity';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
  ) {}

  @Post('/add')
  async addTicket(@Body() ticket: TicketDTO): Promise<Object> {
    return await this.ticketService.addTicket(ticket);
  }

  @Put('/edit')
  async editTicket(@Body() ticket: TicketDTO): Promise<Object> {
    const { id, ...info } = ticket;
    return await this.ticketService.editTicket(id, info);
  }


  @Get('')
  async getAll(): Promise<Ticket[]> {
    return this.ticketService.getTickets({});
  }
}
