import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import { IS_PRODUCTION, SESSION_SECRET } from '../..//utils/constants.js';

const sessionConfig = session({
  secret: SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: IS_PRODUCTION, sameSite: 'lax', signed: true },
  genid: () => uuidv4(),
});

export default sessionConfig;