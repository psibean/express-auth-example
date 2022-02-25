import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', (req, res) => {
  res.send("Hello World");
})

export default app;