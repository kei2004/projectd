// src/video/video.controller.ts
import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('presigned-url')
  @UseGuards(AuthGuard('jwt'))
  async getPresignedUrl(@Body() body: { fileName: string; fileType: string }) {
    // フロントから「ファイル名」と「種類」を受け取る
    return this.videoService.generatePresignedUrl(body.fileName, body.fileType);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req: any, @Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(req.user, createVideoDto);
  }

  @Get()
  findAll(@Query('genre') genre?: string) { 
    return this.videoService.findAll(genre);
  }
}