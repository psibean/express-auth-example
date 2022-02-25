import cookieParser from 'cookie-parser';
import cors from './config/cors.js';
import csrf from './config/csrf.js'
import express from 'express';
import session from './config/session.js'
import setCsrf from './middleware/setCsrf.js';
import { COOKIE_SECRET } from '../utils/constants.js';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors);

app.use(session);
app.use(cookieParser(COOKIE_SECRET));
app.use(csrf);
app.use(setCsrf);

app.use('/', (req, res) => {
  res.send("Hello World");
})

export default app;