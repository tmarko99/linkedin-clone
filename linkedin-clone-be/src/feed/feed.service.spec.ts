import { CreateUserDto } from './../auth/dto/create-user.dto';
import { User } from './../auth/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import * as httpMocks from 'node-mocks-http';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeedPost } from './post.entity';
import { PostDto } from './dto/post.dto';

describe('FeedService', () => {
  let feedService: FeedService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user['firstName'] = 'John';

  const mockFeedPost: PostDto = {
    body: 'body',
    createdAt: new Date(),
    author: mockRequest.user as CreateUserDto,
  };

  const mockFeedPostRepository = {
    createPost: jest
      .fn()
      .mockImplementation((postDto: PostDto, author: User) => {
        return {
          ...postDto,
          author,
        };
      }),
    save: jest
      .fn()
      .mockImplementation((feedPost: FeedPost) =>
        Promise.resolve({ id: 1, ...feedPost }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: getRepositoryToken(FeedPost),
          useValue: mockFeedPostRepository,
        },
      ],
    }).compile();

    feedService = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(feedService).toBeDefined();
  });

  it('should create a feed post', (done: jest.DoneCallback) => {
    feedService
      .createPost(mockFeedPost, mockRequest.user as User)
      .subscribe((feedPost: FeedPost) => {
        expect(feedPost).toEqual({
          id: expect.any(Number),
          ...mockFeedPost,
        });
        done();
      });
  });
});
