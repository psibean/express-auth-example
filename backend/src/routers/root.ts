import { Request, Response, Router } from 'express';
import registrationRouter from './registration.js';

const rootRouter = Router({
  caseSensitive: false,
});

rootRouter.use('/registration', registrationRouter);

export default rootRouter;