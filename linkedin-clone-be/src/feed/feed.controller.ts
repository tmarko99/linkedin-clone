import { UpdateResult, DeleteResult } from 'typeorm';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { PostDto } from './dto/post.dto';
import { Observable } from 'rxjs';
import { FeedPost } from './post.entity';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  findAllPosts(): Observable<FeedPost[]> {
    return this.feedService.findAllPosts();
  }

  @Post()
  createPost(@Body() postDto: PostDto): Observable<FeedPost> {
    return this.feedService.createPost(postDto);
  }

  @Put('/:id')
  updatePost(
    @Param('id') id: number,
    @Body() postDto: PostDto,
  ): Observable<UpdateResult> {
    return this.feedService.updatePost(id, postDto);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }
}
