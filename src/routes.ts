import express from 'express';

import CryptographyController from './App/Controllers/Cryptography';

const routes = express.Router();

routes.get('/cryptographys', CryptographyController.run);

export default routes;
