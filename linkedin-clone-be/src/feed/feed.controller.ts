import { User } from '../auth/entities/user.entity';
import { GetUser } from './../auth/decorators/get-user.decorator';
import { UpdateResult, DeleteResult } from 'typeorm';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { PostDto } from './dto/post.dto';
import { Observable } from 'rxjs';
import { FeedPost } from './post.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Role } from 'src/auth/entities/role.enum';
// import { RolesGuard } from 'src/auth/guards/roles.guards';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  findAllPosts(
    @Query('take') take = 1,
    @Query('skip') skip = 1,
  ): Observable<FeedPost[]> {
    take = take > 20 ? 20 : take;
    return this.feedService.findAllPosts(take, skip);
  }

  @Get('/image/:fileName')
  findImageByName(@Param('fileName') fileName: string, @Res() res) {
    if (!fileName || ['null', '[null]'].includes(fileName)) return;

    return res.sendFile(fileName, { root: './images' });
  }

  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @Post()
  createPost(
    @Body() postDto: PostDto,
    @GetUser() currentUser: User,
  ): Observable<FeedPost> {
    return this.feedService.createPost(postDto, currentUser);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put('/:id')
  updatePost(
    @Param('id') id: number,
    @Body() postDto: PostDto,
  ): Observable<UpdateResult> {
    return this.feedService.updatePost(id, postDto);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete('/:id')
  deletePost(@Param('id') id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }
}
