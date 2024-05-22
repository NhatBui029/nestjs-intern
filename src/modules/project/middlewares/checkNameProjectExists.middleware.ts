import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ProjectService } from '../project.service';

@Injectable()
export class CheckNameProjectExists implements NestMiddleware {
  constructor(private readonly projectService: ProjectService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { id, name } = req.body ;

    const projectExists = await this.projectService.getProject({name: name},{});

    if(id && projectExists[0]?.id == id) return next();

    if (projectExists.length > 0)
      return res
        .status(400)
        .json({ status: false, message: 'Project name already exists !' });

    next();
  }
}
