import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberDTO } from './dto/member.dto';
import { Member } from 'src/entities/member.entity';
import { SearchMemberDTO } from './dto/searchMember.dto';
import { Ticket } from 'src/entities/ticket.entity';
import { HiddenTicketContent } from 'src/interceptors/hiddenTicketContent.interceptor';
import { SetTicketDTO } from './dto/setTicket.dto';
import { TicketService } from '../ticket/ticket.service';
import { BcryptService } from '../auth/bcrypt.service';
import { Roles } from 'src/guard/roles.decorator';
import { Role } from 'src/guard/role.enum';

@Controller('member')
@UseInterceptors(ClassSerializerInterceptor)
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly ticketService: TicketService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('/search')
  async search(@Body() info: SearchMemberDTO): Promise<Member[]> {
    return await this.memberService.searchMember(info.text);
  }

  @Post('/add')
  async addMember(@Body() member: MemberDTO): Promise<Object> {
    const { password } = member;
    const hashPassword = await this.bcryptService.hashPassword(password);
    return await this.memberService.addMember({
      ...member,
      password: hashPassword,
    });
  }

  @Put('/edit')
  async editMember(@Body() infoEdit: MemberDTO) {
    const { id, password, ...info } = infoEdit;

    if (password) {
      const hashPassword = await this.bcryptService.hashPassword(password);
      return await this.memberService.editMember(id, {
        ...info,
        password: hashPassword,
      });
    }

    return await this.memberService.editMember(id, info);
  }

  @Get('/tickets/:id')
  @UseInterceptors(new HiddenTicketContent())
  async getTickets(@Param('id', ParseIntPipe) id: number): Promise<Ticket[]> {
    return await this.memberService.getTicket(id);
  }

  @Post('/set-ticket')
  async setTicket(@Body() info: SetTicketDTO): Promise<Object> {
    const { id, tickets } = info;
    const listTicket = await this.ticketService.getTicketsByIDS(tickets);
    if (tickets.length !== listTicket.length)
      return { status: false, message: 'One or more tickets do not exist.' };
    return await this.memberService.setTicket(id, listTicket);
  }

  @Get('/all')
  @Roles(Role.Admin)
  async getAll(): Promise<Member[]> {
    return await this.memberService.getMember({});
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Member[]> {
    return await this.memberService.getMember({ id: id });
  }
}
