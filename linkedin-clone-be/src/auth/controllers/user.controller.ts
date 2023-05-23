import { map, switchMap } from 'rxjs/operators';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Get,
  Res,
  Param,
  Put,
  Body,
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
import { User } from '../entities/user.entity';
import { FriendRequest } from '../entities/friend-request.entity';
import { GetUser } from '../decorators/get-user.decorator';
import { Status } from '../entities/friend-request-status.enum';
import { FriendRequestDto } from '../dto/friend-request.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() currentUser: User,
  ): Observable<{ modifiedFileName: string } | { error: string }> {
    const fileName = file?.filename;

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = currentUser.id;
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
  findImage(@GetUser() currentUser: User, @Res() res): Observable<any> {
    const userId = currentUser.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image-name')
  findUserImageName(
    @GetUser() currentUser: User,
  ): Observable<{ imageName: string }> {
    const userId = currentUser.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of({ imageName });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('/:userId')
  findUserById(@Param('userId') userId: number): Observable<User> {
    return this.userService.findUserById(userId);
  }

  @UseGuards(JwtGuard)
  @Post('/friend-request/send/:receiverId')
  sendConnectionRequest(
    @Param('receiverId') receiverId: number,
    @GetUser() currentUser: User,
  ): Observable<FriendRequest | { error: string }> {
    return this.userService.sendConnectionRequest(receiverId, currentUser);
  }

  @UseGuards(JwtGuard)
  @Get('/friend-request/status/:receiverId')
  getFriendRequstStatus(
    @Param('receiverId') receiverId: number,
    @GetUser() currentUser: User,
  ): Observable<{ status: Status }> {
    return this.userService.getFriendRequstStatus(receiverId, currentUser);
  }

  @UseGuards(JwtGuard)
  @Get('/friend-request/me/received-requests')
  getMyFriendRequsts(
    @GetUser() currentUser: User,
  ): Observable<{ status: Status }[]> {
    return this.userService.getMyFriendRequsts(currentUser);
  }

  @UseGuards(JwtGuard)
  @Put('/friend-request/response/:friendRequstId')
  respondToFriendRequstStatus(
    @Param('friendRequstId') friendRequstId: number,
    @Body() status: FriendRequestDto,
  ): Observable<{ status: Status }> {
    return this.userService.respondToFriendRequstStatus(
      friendRequstId,
      status.status,
    );
  }
}
