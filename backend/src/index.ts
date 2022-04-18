import app from './server/app.js';
import { EXPRESS_PORT } from './utils/constants.js';
import rootRouter from './routers/root.js';


process.on('uncaughtException', error => console.log(error));

app.use('/', rootRouter);

app.listen(EXPRESS_PORT, () => {
  console.log(`Express auth example application is listening at http://localhost:${EXPRESS_PORT}..`);
})