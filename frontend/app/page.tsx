'use client'; 

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Video = {
  id: string;
  title: string;
  description: string;
  genre: string;
  videoUrl: string;
  user: {
    id: string;
    username: string;
  };
};

export default function Home() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [userRole, setUserRole] = useState('');

  const [selectedGenre, setSelectedGenre] = useState('All');

  const handleJoin = async (teacherId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('ログインしていません！');

      await axios.post(
        'http://localhost:3001/chat',
        { teacherId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('チャットルームに参加しました！');
      router.push('/chat'); 
    } catch (error) {
      console.error(error);
      alert('チャットルームの参加に失敗しました...');
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
    
    const fetchVideos = async () => {
      try {
        // params に genre を渡す
        const response = await axios.get('http://localhost:3001/video', {
          params: { genre: selectedGenre } 
        });
        console.log('取得したデータ:', response.data);
        setVideos(response.data); 
      } catch (error) {
        console.error('エラーが発生しました:', error);
      }
    };

    fetchVideos();
  }, [selectedGenre]); 

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-blue-600">Project D 動画一覧</h1>
        
        <select 
          className="border border-gray-300 p-2 rounded shadow bg-white text-gray-700"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="All">全てのジャンル</option>
          <option value="HipHop">HipHop</option>
          <option value="Jazz">Jazz</option>
          <option value="Lock">Lock</option>
          <option value="Break">Break</option>
          <option value="Pop">Pop</option>
          <option value="House">House</option>
          <option value="Waack">Waack</option>
          <option value="Krump">Krump</option>
          <option value="Other">Other</option>
        </select>

        {userRole === 'teacher' && (
          <Link 
            href="/upload" 
            className="bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition"
          >
            動画を投稿する
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {video.genre}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">{video.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{video.description}</p>
            
            {/* 動画プレイヤー */}
            <video 
              src={video.videoUrl} 
              controls 
              className="w-full h-48 bg-black rounded"
            />
            {/* 生徒の時だけ出る「習いたい」ボタン */}
            {userRole === 'student' && (
              <button
                onClick={() => handleJoin(video.user.id)}
                className="mt-4 w-64 mx-auto block bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition"
              >
                この先生に習う！
              </button>
            )}
            
            <p className="mt-2 text-right text-sm text-gray-500">
              By {video.user?.username}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}