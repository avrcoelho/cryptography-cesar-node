import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

class App {
  public server: http.Server;
  public app: express.Application;

  public constructor() {
    this.app = express();
    this.server = new http.Server(this.app);

    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(cors());
  }

  private routes() {
    this.app.use(routes);
  }
}

export default new App().server;
