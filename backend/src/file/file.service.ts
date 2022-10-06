import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, remove, writeFile } from 'fs-extra';

import { IFileResponse } from './file.interface';

@Injectable()
export class FileService {
  async uploadFile(
    uploadFile: Express.Multer.File,
    userId: number,
    folder: string,
    fileName: string,
  ): Promise<IFileResponse> {
    const uploadFolder = `${path}/uploads/${userId}/${folder}`;
    const newFileName = `${fileName}.${
      (/[^./\\]*$/.exec(uploadFile.originalname) || [''])[0]
    }`;

    await ensureDir(uploadFolder);

    await writeFile(`${uploadFolder}/${newFileName}`, uploadFile.buffer);

    return {
      url: `/uploads/${userId}/${folder}/${newFileName}`,
      name: newFileName,
    };
  }

  async deleteFile(deleteFileName: string, userId: number, folder: string) {
    const deleteFolder = `${path}/uploads/${userId}/${folder}`;

    return await remove(`${deleteFolder}/${deleteFileName}`);
  }

  async deleteFolder(userId: number, folder?: string) {
    let deleteFolder = `${path}/uploads/${userId}`;

    if (folder) deleteFolder = deleteFolder + '/' + folder;

    return await remove(deleteFolder);
  }
}
