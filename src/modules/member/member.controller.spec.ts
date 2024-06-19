import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TicketService } from '../ticket/ticket.service';
import { BcryptService } from '../auth/bcrypt.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { Role } from 'src/entities/role.entity';
import {Repository} from "typeorm"

describe('MemberController', () => {
  let appController: MemberController;
  let spyService: MemberService;
  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: MemberService,
      useFactory: () => ({
        searchMember: jest.fn(() => {
            return {
                "id": 2,
                "name": "thanhtam",
                "username": "tamtit",
                "avatar": null,
                "createAt": "2024-04-24T02:13:58.236Z",
                "updatedAt": "2024-04-24T02:13:58.236Z",
                "deletedAt": null
            }
        }),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        MemberService,
        ApiServiceProvider,
        TicketService,
        BcryptService,
        {
            provide: getRepositoryToken(Ticket),
            useClass: Repository
        }
      ],
    }).compile();
    appController = app.get<MemberController>(MemberController);
    spyService = app.get<MemberService>(MemberService);
  });

  describe('search', () => {
    it('search member have name contain am', async () => {
      expect(spyService.searchMember('am')).toEqual({
        "id": 2,
        "name": "thanhtam",
        "username": "tamtit",
        "avatar": null,
        "createAt": "2024-04-24T02:13:58.236Z",
        "updatedAt": "2024-04-24T02:13:58.236Z",
        "deletedAt": null
    });
    });
  });
});
