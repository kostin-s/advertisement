import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from './file.service';
import { Auth } from 'src/auth/decoratos/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { FileDeleteDto, FileDto } from './dto/file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() mediaFile: Express.Multer.File,
    @CurrentUser('id') currentUserId: number,
    @Body() dto: FileDto,
  ) {
    return this.fileService.uploadFile(mediaFile, currentUserId, dto.folder);
  }

  @UsePipes(new ValidationPipe())
  @Delete('delete')
  @HttpCode(200)
  @Auth()
  async deleteFile(
    @CurrentUser('id') currentUserId: number,
    @Body() dto: FileDeleteDto,
  ) {
    return this.fileService.deleteFile(dto.fileName, currentUserId, dto.folder);
  }

  @Delete('delete/folder')
  @HttpCode(200)
  @Auth()
  async deleteUser(
    @CurrentUser('id') currentUserId: number,
    @Body('folder') folder?: string,
  ) {
    return this.fileService.deleteFolder(currentUserId, folder);
  }
}
