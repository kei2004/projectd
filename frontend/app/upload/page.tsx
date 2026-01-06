'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Break'); // デフォルト値
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('動画ファイルを選択してください');

    setIsLoading(true); 

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('ログインしていません！');

      const presignedRes = await axios.post(
        'http://localhost:3001/video/presigned-url',
        {
          fileName: file.name,
          fileType: file.type, // video/mp4 とか video/quicktime
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { uploadUrl, key } = presignedRes.data;

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });

      const publicUrl = `https://pub-b361ec2583024b20889f4bc09ca0c52b.r2.dev/${key}`;

      await axios.post(
        'http://localhost:3001/video',
        {
          title,
          description,
          genre,
          videoUrl: publicUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('アップロード完了！');
      router.push('/'); // トップページに戻る

    } catch (error) {
      console.error(error);
      alert('アップロードに失敗しました...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">動画アップロード</h1>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          
          <label className="text-sm font-bold">タイトル</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="text-sm font-bold">ジャンル</label>
          <select 
            className="border p-2 rounded"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="Break">Break</option>
            <option value="HipHop">HipHop</option>
            <option value="Pop">Pop</option>
            <option value="Lock">Lock</option>
            <option value="Waack">Waack</option>
            <option value="Krump">Krump</option>
            <option value="House">House</option>
            <option value="Other">Other</option>
          </select>

          <label className="text-sm font-bold">説明文</label>
          <textarea
            className="border p-2 rounded"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="text-sm font-bold">動画ファイル</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className={`mt-4 text-white p-3 rounded font-bold ${
              isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'アップロード中...' : '投稿する'}
          </button>
        </form>
      </div>
    </div>
  );
}