import express from 'express';
import clienteRouter from './cliente/router.js';

const app = express();

app.use(express.json());

app.use('/cliente', clienteRouter);

app.listen(3000, () => {
  console.log('servidor rodando na porta 3000, http://localhost:3000');
})