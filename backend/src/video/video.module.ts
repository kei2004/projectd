import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), AuthModule], // 必要に応じてVideoエンティティをここに追加
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
