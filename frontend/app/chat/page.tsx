'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type ChatRoom = {
  id: string;
  student: { username: string };
  teacher: { username: string };
};

export default function ChatListPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3001/chat', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">チャットルーム一覧</h1>
      
      <div className="max-w-md mx-auto flex flex-col gap-4">
        {rooms.length === 0 && <p className="text-center">まだメッセージはありません</p>}
        
        {rooms.map((room) => (
          <div key={room.id} 
          onClick={() => router.push(`/chat/${room.id}`)}
          className="bg-white p-4 rounded shadow hover:bg-gray-100 cursor-pointer">
            <h2 className="font-bold text-lg">
              {/* 相手の名前を表示したい（簡易的に両方表示） */}
              講師: {room.teacher.username} / 生徒: {room.student.username}
            </h2>
            <p className="text-gray-500 text-sm">クリックしてメッセージを送る (準備中)</p>
          </div>
        ))}
      </div>
    </div>
  );
}