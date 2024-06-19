import { Repository, Like } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Member } from 'src/entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberDTO } from './dto/member.dto';
import { Ticket } from 'src/entities/ticket.entity';
import { List, SetTicketDTO } from './dto/setTicket.dto';
import { Role } from 'src/entities/role.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberReposioty: Repository<Member>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async getMember(condition: any): Promise<Member[]> {
    return await this.memberReposioty.find({
      where: { ...condition },
      relations: {
        roles: true,
    },
    });
  }

  async getMe(token: string): Promise<Object>{
    const verifyAsync = await this.jwtService.verifyAsync(token, {
      secret: process.env.SECRET_KEY,
    });
    return {name: verifyAsync?.username};
  }

  async getTicket(id: number): Promise<Ticket[]> {
    const member = await this.memberReposioty.findOne({
      where: { id: id },
      relations: {
        tickets: true,
      },
    });
    return member.tickets;
  }

  async setTicket(id: number, tickets: Ticket[]): Promise<Object> {
    try {
      const member = await this.getMember({id:id});
      if (!member)
        return {
          status: false,
          message: `Member does not exists !`,
        };
      member[0].tickets = tickets;
      await this.memberReposioty.save(member);
      return {
        status: true,
        message: `Assign tickets for member id: ${id} successfully !`,
      };
    } catch (error) {
      return { status: false, message: `Error: ${error}` };
    }
  }

  async searchMember(info: string): Promise<Member[]> {
    return await this.memberReposioty.find({
      where: [{ name: Like(`%${info}%`) }, { username: Like(`%${info}%`) }],
    });
  }

  async addMember(member: MemberDTO): Promise<Object> {
    try {
      const userRole = await this.roleRepository.findOne({
        where: {
          id: 2,
          name: 'user'
        }
      })
      const newUser = await this.memberReposioty.save({
        ...member,
      });

      newUser.roles = [userRole];
      await this.memberReposioty.save(newUser)

      return { status: 'success', id: newUser.id };
    } catch (e) {
      return { status: false, message: `Error: ${e}` };
    }
  }

  async editMember(id: number, infoEdit: MemberDTO): Promise<Object> {
    const userEdited = await this.memberReposioty.update(
      { id: id },
      { ...infoEdit },
    );
    // return await this.memberReposioty
    //   .createQueryBuilder()
    //   .update(Member)
    //   .set(infoEdit)
    //   .where('id= :id', { id: id })
    //   .execute();
    return { status: 'success', message: 'Update success !' };
  }

  async getMemberAssignedToTicket(ticketId: number): Promise<Member | undefined> {
    try {
      const member = await this.memberReposioty
        .createQueryBuilder('member')
        .leftJoinAndSelect('member.tickets', 'ticket')
        .where('ticket.id = :id', { id: ticketId })
        .getOne();

      return member;
    } catch (error) {
      throw new Error('Error getting member assigned to ticket: ' + error.message);
    }
  }
}
