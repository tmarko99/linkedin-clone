import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPost } from './post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PostDto } from './dto/post.dto';
import { Observable, from } from 'rxjs';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPost)
    private readonly feedRepository: Repository<FeedPost>,
  ) {}

  createPost(postDto: PostDto): Observable<FeedPost> {
    return from(this.feedRepository.save(postDto));
  }

  findAllPosts(): Observable<FeedPost[]> {
    return from(this.feedRepository.find());
  }

  updatePost(id: number, postDto: PostDto): Observable<UpdateResult> {
    return from(this.feedRepository.update(id, postDto));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedRepository.delete(id));
  }
}
