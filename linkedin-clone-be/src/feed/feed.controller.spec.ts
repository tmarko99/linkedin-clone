import { User } from './../auth/entities/user.entity';
import { CreateUserDto } from './../auth/dto/create-user.dto';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { JwtGuard } from './../auth/guards/jwt.guard';
import { UserService } from './../auth/services/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

import * as httpMocks from 'node-mocks-http';
import { PostDto } from './dto/post.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('FeedController', () => {
  let feedController: FeedController;
  let feedService: FeedService;
  let userService: UserService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user['firstName'] = 'John';

  const mockFeedPost: PostDto = {
    body: 'body',
    createdAt: new Date(),
    author: mockRequest.user as CreateUserDto,
  };

  const mockFeedPosts: PostDto[] = [
    {
      body: 'body',
      createdAt: new Date(),
      author: mockRequest.user as CreateUserDto,
    },
    {
      body: 'second feed post',
      createdAt: new Date(),
      author: mockRequest.user as CreateUserDto,
    },
    {
      body: 'third feed post',
      createdAt: new Date(),
      author: mockRequest.user as CreateUserDto,
    },
  ];

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  const mockUpdateResult: UpdateResult = {
    ...mockDeleteResult,
    generatedMaps: [],
  };

  const mockFeedService = {
    createPost: jest
      .fn()
      .mockImplementation((postDto: PostDto, author: User) => {
        return {
          id: 1,
          ...postDto,
        };
      }),
    findAllPosts: jest.fn().mockImplementation((take: number, skip: number) => {
      const feedPostAfterSkipping = mockFeedPosts.slice(skip);
      const filteredFeedPosts = feedPostAfterSkipping.slice(0, take);

      return filteredFeedPosts;
    }),
    updatePost: jest.fn().mockImplementation(() => {
      return mockUpdateResult;
    }),
    deletePost: jest.fn().mockImplementation(() => {
      return mockDeleteResult;
    }),
  };

  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        { provide: UserService, useValue: mockUserService },
        {
          provide: JwtGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: IsCreatorGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(FeedService)
      .useValue(mockFeedService)
      .compile();

    feedService = module.get<FeedService>(FeedService);
    userService = module.get<UserService>(UserService);

    feedController = module.get<FeedController>(FeedController);
  });

  it('should be defined', () => {
    expect(feedController).toBeDefined();
  });

  it('should create a feed post', () => {
    expect(
      feedController.createPost(mockFeedPost, mockRequest.user as User),
    ).toEqual({
      id: expect.any(Number),
      ...mockFeedPost,
    });
  });

  it('should get 2 feed posts, skipping the first', () => {
    expect(feedController.findAllPosts(2, 1)).toEqual(mockFeedPosts.slice(1));
  });

  it('should update a feed post', () => {
    expect(
      feedController.updatePost(1, { ...mockFeedPost, body: 'updated body' }),
    ).toEqual(mockUpdateResult);
  });

  it('should delete a feed post', () => {
    expect(feedController.deletePost(1)).toEqual(mockDeleteResult);
  });
});
