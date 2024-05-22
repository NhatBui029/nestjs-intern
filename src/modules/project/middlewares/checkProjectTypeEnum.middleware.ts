import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ProjectService } from '../project.service';
import { ProjectType } from 'src/entities/project.entity';

@Injectable()
export class CheckProjectTypeEnum implements NestMiddleware {
  constructor(private readonly projectService: ProjectService) {}

  private isProjectType(value: any): value is ProjectType {
    return ['LABOUR', 'FIX_PRICE', 'MAINTENANCE'].indexOf(value) !== -1;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { projectType } = req.body ;

    if(!projectType || !this.isProjectType(projectType)){
      return res
        .status(400)
        .json({ status: false, message: 'Project type invalid!' });
    }

    return next();
  }
}
