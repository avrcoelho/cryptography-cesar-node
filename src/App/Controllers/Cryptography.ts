import { Request, Response } from 'express';
import sha1 from 'sha1';
import path from 'path';
import FormData from 'form-data';
import fs from 'fs';

import api from '../services/api';
import SaveFile from '../services/SaveFile';

type Data = {
  numero_casas: number;
  token: string;
  cifrado: string;
  decifrado: string;
  resumo_criptografico: string;
};

class CryptographyController {
  async run(req: Request, res: Response) {
    try {
      const { data }: { data: Data } = await api.get(
        `/v1/challenge/dev-ps/generate-data?token=${process.env.TOKEN}`,
      );

      SaveFile.run(data);

      const encryptedLength = data.cifrado.length;
      const alphabetLength = 26;
      const codeFirstLetter = 65;

      let deciphered = '';

      for (let index = 0; index < encryptedLength; index++) {
        const caracter = data.cifrado.substr(index, 1).toLocaleUpperCase();

        if (/[A-Z]/.test(caracter)) {
          const codeASC = caracter.charCodeAt(0);

          const indexAlphabet =
            ((codeASC + codeFirstLetter - data.numero_casas) % alphabetLength) +
            codeFirstLetter;

          const caracterDeciphered = String.fromCharCode(indexAlphabet);

          deciphered = `${deciphered}${caracterDeciphered}`;
        } else {
          deciphered = `${deciphered}${caracter}`;
        }
      }

      deciphered = deciphered.toLocaleLowerCase();
      const decipheredSHA1 = sha1(deciphered);

      const newData: Data = {
        ...data,
        decifrado: deciphered,
        resumo_criptografico: decipheredSHA1,
      };

      SaveFile.run(newData);

      const form = new FormData();

      form.append(
        'answer',
        fs.createReadStream(
          path.resolve(__dirname, '..', '..', '..', 'answer.json'),
        ),
      );

      const response = await api.post(
        `/v1/challenge/dev-ps/submit-solution?token=${process.env.TOKEN}`,
        form,
        { headers: form.getHeaders() },
      );

      return res.json(response);
    } catch (error) {
      return res.send({ message: error.message }).status(400);
    }
  }
}

export default new CryptographyController();
