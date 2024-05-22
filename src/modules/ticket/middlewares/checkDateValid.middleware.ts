import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function CheckDateValid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { deadline } = req.body;
  const dateObject = new Date(deadline);

  if (isNaN(dateObject.getTime())) {
    return res
      .status(400)
      .json({ status: false, message: 'Deadline invalid Date !' });
  } else {
    return next();
  }
}
