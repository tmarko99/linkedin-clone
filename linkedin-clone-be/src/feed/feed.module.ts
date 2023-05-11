import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedPost } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedPost])],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
