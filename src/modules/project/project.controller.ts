import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDTO } from './dto/project.dto';
import { Project, ProjectType } from 'src/entities/project.entity';
import { SearchProjectDTO } from './dto/searchProject.dto';
import { Ticket } from 'src/entities/ticket.entity';
import { HiddenTicketContent } from '../../interceptors/hiddenTicketContent.interceptor';
import { Roles } from 'src/guard/roles.decorator';
import { Role } from 'src/guard/role.enum';

export const PAGE_LIMIT = 5;

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/add')
  @Roles(Role.Admin)
  async addProject(@Body() project: ProjectDTO): Promise<Object> {
    return await this.projectService.addProject(project);
  }

  @Put('/edit')
  @Roles(Role.Admin)
  async editProject(@Body() project: ProjectDTO): Promise<Object> {
    const { id, ...info } = project;
    return await this.projectService.editProject(id, info);
  }

  @Post('/search')
  async searchProject(@Body() info: SearchProjectDTO): Promise<Project[]> {
    return await this.projectService.searchProject(info);
  }

  @Get('/type/:type')
  async getByType(@Param('type') type: ProjectType): Promise<Project[]> {
    return await this.projectService.getProject({ projectType: type }, {});
  }

  @Get('/tickets/:id')
  @UseInterceptors(new HiddenTicketContent())
  async getTickets(@Param('id', ParseIntPipe) id: number): Promise<Ticket[]> {
    return await this.projectService.getTicket(id);
  }

  @Get('/export-csv')
  async exportCSV(){
    try {
      const filePath = await this.projectService.exportCSV();
      return {status: true, message: `CSV file has been exported to ${filePath}`}
    } catch (error) {
      console.error('Error exporting tickets:', error);
    }
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Project[]> {
    return await this.projectService.getProject({ id: id }, {});
  }

  @Get('')
  async getAll(@Query('page') page: number = 0): Promise<Project[]> {
    const option =
      page == 0 ? {} : { skip: PAGE_LIMIT * (page - 1), take: PAGE_LIMIT };
    return await this.projectService.getProject({}, option);
  }
}
