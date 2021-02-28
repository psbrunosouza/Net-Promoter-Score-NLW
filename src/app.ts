import 'reflect-metadata';
import express, { NextFunction, Response, Request} from 'express';
import 'express-async-errors';
import createConnection from './database';
import { router } from './routes';
import { AppError } from './errors/AppError';

/*
  GET => BUSCA
  POST => SALVAR
  PUT => ATUALIZAR
  DELETE => APAGAR
  PATCH => ALTERAÇÃO ESPECIFICA
*/
createConnection();
const app = express();

app.use(express.json());
app.use(router);

app.use((
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if(err instanceof AppError){
    return response.status(err.statusCode).json({
      message: err.message
    });
  }

  return response.status(500).json({
    status: "error",
    message:  `Internal server ERROR ${err.message}`
  });
});

export { app };