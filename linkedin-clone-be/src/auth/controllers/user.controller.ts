import { map, switchMap } from 'rxjs/operators';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
  Get,
  Res,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  isFileExtensionSafe,
  removeFile,
  saveImageToStorage,
} from '../helpers/image-storage';
import { of, Observable } from 'rxjs';
import { join } from 'path';
import { UpdateResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Observable<{ modifiedFileName: string } | { error: string }> {
    const fileName = file?.fieldname;

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(__dirname, 'images');
    const fullImagePath = join(imagesFolderPath + '/' + file.fieldname);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;
          return this.userService.updateUserImageById(userId, fileName).pipe(
            map(() => ({
              modifiedFileName: file.filename,
            })),
          );
        }
        removeFile(fullImagePath);
        return of({ error: 'File content does not match extension!' });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('/image')
  findImage(@Req() req, @Res() res): Observable<any> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('/image-name')
  findUserImageName(@Req() req, @Res() res): Observable<{ imageName: string }> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of({ imageName });
      }),
    );
  }
}
