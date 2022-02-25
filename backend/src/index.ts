import app from './server/app.js';

process.on('uncaughtException', error => console.log(error));

app.listen(4444, () => {
  console.log("Express auth example application is listening at http://localhost:4444...");
})