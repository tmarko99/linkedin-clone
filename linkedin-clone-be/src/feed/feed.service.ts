import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPost } from './post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PostDto } from './dto/post.dto';
import { Observable, from } from 'rxjs';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPost)
    private readonly feedRepository: Repository<FeedPost>,
  ) {}

  createPost(postDto: PostDto, author: User): Observable<FeedPost> {
    return from(this.feedRepository.save({ ...postDto, author }));
  }

  findAllPosts(take = 10, skip = 0): Observable<FeedPost[]> {
    return from(
      this.feedRepository
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.author', 'author')
        .orderBy('post.createdAt', 'DESC')
        .take(take)
        .skip(skip)
        .getMany(),
    );
  }

  findPostById(id: number): Observable<FeedPost> {
    return from(
      this.feedRepository.findOne({
        where: {
          id,
        },
        relations: ['author'],
      }),
    );
  }

  updatePost(id: number, postDto: PostDto): Observable<UpdateResult> {
    return from(this.feedRepository.update(id, postDto));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedRepository.delete(id));
  }
}
