import express from 'express';
import cors from './config/cors.js';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors);

app.use('/', (req, res) => {
  res.send("Hello World");
})

export default app;