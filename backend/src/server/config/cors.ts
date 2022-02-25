import cors from 'cors';

import { ALLOWED_ORIGINS } from '../../utils/constants.js';

const corsConfig = cors({
  origin: ALLOWED_ORIGINS,
  optionsSuccessStatus: 200,
  credentials: true,
});

export default corsConfig;