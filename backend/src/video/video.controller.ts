// src/video/video.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('presigned-url')
  async getPresignedUrl(@Body() body: { fileName: string; fileType: string }) {
    // フロントから「ファイル名」と「種類」を受け取る
    return this.videoService.generatePresignedUrl(body.fileName, body.fileType);
  }
}