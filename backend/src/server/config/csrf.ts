import csurf from 'csurf';
import { Request } from 'express';
import { IS_PRODUCTION } from '../../utils/constants.js';

const csrf = csurf({
  cookie: {
    signed: true,
    sameSite: 'strict',
    secure: IS_PRODUCTION,
    domain: process.env.FRONTEND_DOMAIN ?? 'localhost',
    httpOnly: false,
  },
  value: (req: Request) => req.headers['x-csrf-token'] as string,
});

export default csrf;