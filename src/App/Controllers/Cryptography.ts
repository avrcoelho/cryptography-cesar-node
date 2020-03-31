import { Request, Response } from 'express';

class CryptographyController {
  async run(req: Request, res: Response) {
    res.json({ message: 'Hello word' });
  }
}

export default new CryptographyController();
