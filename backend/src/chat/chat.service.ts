import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message) private messageRepository: Repository<Message>
  ) {}

  async createRoom(studentId: string, teacherId: string) {
    const existingRoom = await this.chatRoomRepository.findOne({
      where: { student: { id: studentId }, teacher: { id: teacherId } },
    });
    if (existingRoom) {
      return existingRoom;
    }

    const newRoom = this.chatRoomRepository.create({
      student: { id: studentId },
      teacher: { id: teacherId },
    });
    return this.chatRoomRepository.save(newRoom);
  }

  async getMyRooms(userId: string) {
    return this.chatRoomRepository.find({
      where: [
        { student: { id: userId } },
        { teacher: { id: userId } }
      ],
      relations: ['student', 'teacher'],
      order: { createdAt: 'DESC' },
    });
  }

  async sendMessage(roomId: string, senderId: string, content: string, type: string = 'text') {
    const message = this.messageRepository.create({
      content,
      type,
      sender: { id: senderId },
      chatRoom: { id: roomId },
    });
    return this.messageRepository.save(message);
  }

  async getMessages(roomId: string) {
    return this.messageRepository.find({
      where: { chatRoom: { id: roomId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}