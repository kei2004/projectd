import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body('teacherId') teacherId: string, @Req() req: any) {
    const studentId = req.user.id;
    return this.chatService.createRoom(studentId, teacherId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMyRooms(@Req() req: any) {
    const userId = req.user.id;
    return this.chatService.getMyRooms(userId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // 保存されたファイル名を返す
    return { filename: file.filename };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':roomId/messages')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }
}