'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';

type Message = {
  id: string;
  content: string;
  type: string; // 'text' or 'video'
  sender: { username: string };
  createdAt: string;
};

export default function ChatRoomPage() {
  const { id: roomId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [myUsername, setMyUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ファイル入力用の隠しref
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const username = localStorage.getItem('username') || '自分';
    setMyUsername(username);

    // 1. 過去ログ取得
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:3001/chat/${roomId}/messages`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (error) {
        console.error('メッセージ取得失敗', error);
      }
    };
    fetchMessages();

    // 2. Socket接続
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', roomId);
    });

    newSocket.on('newMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => { newSocket.close(); };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // テキスト送信
  const handleSendText = () => {
    if (!socket || !input.trim()) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('エラー: 再ログインしてください');

    socket.emit('sendMessage', {
      roomId,
      senderId: userId,
      content: input,
      type: 'text', // テキストとして送信
    });
    setInput('');
  };

  // ▼▼▼ 動画アップロード & 送信 ▼▼▼
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (例: 50MB制限)
    if (file.size > 50 * 1024 * 1024) {
      return alert('ファイルが大きすぎます(50MBまで)');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      alert('動画をアップロード中...お待ちください');
      const res = await axios.post('http://localhost:3001/chat/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const filename = res.data.filename;
      const userId = localStorage.getItem('userId');

      if (socket && userId) {
        socket.emit('sendMessage', {
          roomId,
          senderId: userId,
          content: filename, // ファイル名を中身にする
          type: 'video',     // タイプは動画
        });
      }
    } catch (error) {
      console.error(error);
      alert('アップロード失敗');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white p-4 shadow-md z-10 flex justify-between items-center">
        <h1 className="font-bold text-lg text-gray-700">チャットルーム</h1>
        <a href="/chat" className="text-sm text-blue-500">一覧に戻る</a>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.sender.username === myUsername;
          return (
            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-lg shadow ${
                isMe ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
              }`}>
                <p className="text-xs opacity-75 mb-1 font-bold">{msg.sender.username}</p>
                
                {/* ▼▼▼ メッセージの種類で表示を分ける ▼▼▼ */}
                {msg.type === 'video' ? (
                  <div>
                    <video 
                      src={`http://localhost:3001/uploads/${msg.content}`} 
                      controls 
                      className="w-full rounded max-h-64" 
                    />
                    <p className="text-xs mt-1 opacity-70">📹 動画メッセージ</p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
                
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex gap-2 items-center">
        {/* ▼▼▼ ファイル選択ボタン ▼▼▼ */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="video/*,image/*" 
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-200 text-gray-600 px-3 py-3 rounded-full hover:bg-gray-300 font-bold"
        >
          📎
        </button>

        <input
          className="flex-1 border border-gray-300 p-3 rounded-full focus:outline-none focus:border-blue-500 transition text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
          placeholder="メッセージを入力..."
        />
        <button 
          onClick={handleSendText} 
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow"
        >
          送信
        </button>
      </div>
    </div>
  );
}