import { Project, ProjectType } from './../../entities/project.entity';
import { Repository, Like } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDTO } from './dto/project.dto';
import { SearchProjectDTO } from './dto/searchProject.dto';
import { table } from 'console';
import { Ticket } from 'src/entities/ticket.entity';
import { createObjectCsvWriter } from 'csv-writer';
import { Member } from 'src/entities/member.entity';
import { MemberService } from '../member/member.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectReposioty: Repository<Project>,
    private readonly memberService: MemberService,
  ) {}

  async getTicket(id: number): Promise<Ticket[]> {
    const project = await this.projectReposioty.findOne({
      where: { id: id },
      relations: {
        tickets: true,
      },
    });
    return project.tickets;
  }

  getRandomProjectType(): ProjectType {
    const projectTypes: ProjectType[] = ['LABOUR', 'FIX_PRICE', 'MAINTENANCE'];
    const randomIndex = Math.floor(Math.random() * projectTypes.length);
    return projectTypes[randomIndex];
  }
  getRandomDate(start: Date, end: Date): Date {
    const randomTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async addMillion(): Promise<string> {
    const startDate = new Date(2024, 0, 1); 
    const endDate = new Date(2024, 11, 31, 23, 59, 59);
    for (let i = 0; i < 1000000; i++) {
      const proj: ProjectDTO = {
        name: 'project' + (i + 106).toString(),
        projectType: this.getRandomProjectType(),
        profit: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
        startDate: (this.getRandomDate(startDate, endDate))
      };
      await this.addProject(proj)
    }
    return 'create 100000 project successfull';
  }

  async addProject(project: ProjectDTO): Promise<Object> {
    try {
      const newProject = await this.projectReposioty.save({ ...project });

      if (newProject) return { status: true, id: newProject.id };
    } catch (e) {
      return { status: false, message: `Error: ${e}` };
    }
  }

  async editProject(id: number, info: ProjectDTO): Promise<Object> {
    try {
      const editProject = await this.projectReposioty.update(
        {
          id: id,
        },
        { ...info },
      );

      if (editProject.affected > 0)
        return { status: true, message: 'Update successfully !!' };
      else return { status: false, message: 'No project was edited' };
    } catch (e) {
      return { status: false, message: `Error: ${e}` };
    }
  }

  async getProject(condition: ProjectDTO, option: any): Promise<Project[]> {
    return await this.projectReposioty.find({
      where: { ...condition },
      ...option,
    });
  }

  async exportCSV(): Promise<string> {
    try {
      const csvWriter = createObjectCsvWriter({
        path: 'tickets.csv',
        header: [
          { id: 'ProjectName', title: 'Project Name' },
          { id: 'TicketId', title: 'Ticket ID' },
          { id: 'TicketTitle', title: 'Ticket Title' },
          { id: 'AssigneeName', title: 'Assignee Name' },
          { id: 'TicketStatus', title: 'Ticket Status' },
        ],
      });

      const projects = await this.getProject(
        {},
        {
          relations: {
            tickets: true,
          },
        },
      );

      const csvData = [];

      for (const project of projects) {
        const projectData = [];

        for (const ticket of project.tickets) {
          const assignee = await this.memberService.getMemberAssignedToTicket(
            ticket.id,
          );

          projectData.push({
            ProjectName:
              projectData.length === 0
                ? project.name
                : ' '.repeat(project.name.length),
            TicketId: ticket.id,
            TicketTitle: ticket.title,
            AssigneeName: assignee ? assignee.name : 'Unassigned',
            TicketStatus: ticket.status,
          });
        }

        if (projectData.length > 0) {
          csvData.push(...projectData);
        }
      }

      await csvWriter.writeRecords(csvData);

      return 'tickets.csv';
    } catch (error) {
      console.log(error);
    }
  }

  async searchProject(info: SearchProjectDTO): Promise<Project[]> {
    return await this.projectReposioty.find({
      where: {
        name: Like(`%${info.text}%`),
      },
    });
  }
}
