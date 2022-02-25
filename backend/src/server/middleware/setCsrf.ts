import { Response, Request, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
}