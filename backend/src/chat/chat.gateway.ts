import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) {}

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
        client.join(roomId);
        console.log(`client joined room: ${roomId}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: { roomId: string; senderId: string; content: string; type: string },) {
        console.log('メッセージ受信:', data);

        const savedMessage = await this.chatService.sendMessage(
            data.roomId,
            data.senderId,
            data.content,
            data.type
        );

        this.server.to(data.roomId).emit('newMessage', savedMessage);
    }
}