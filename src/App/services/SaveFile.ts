import fs from 'fs';

class SaveFile {
  run(data: object) {
    fs.writeFile('answer.json', JSON.stringify(data), (error) => {
      if (error) {
        throw new Error('Create file failure');
      }
    });
  }
}

export default new SaveFile();
