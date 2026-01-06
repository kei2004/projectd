'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
      });

      // debug用表示
      console.log('Backendからの返事:', response.data);

      const token = response.data.access_token;
      const role = response.data.role;
      const userId = response.data.id;     
      const myName = response.data.username;

      // LocalStorageに保存
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', myName);

      if (userId) {
        localStorage.setItem('userId', userId);
        console.log('ID保存成功:', userId);
      } else {
        console.error('IDがありません！Backendを確認してください');
      }

      alert('ログイン成功！');
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('ログイン失敗: ユーザー名かパスワードが違います');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">ログイン</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="font-bold text-sm">ユーザー名</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="font-bold text-sm">パスワード</label>
          <input
            type="password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4 font-bold">
            ログイン
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          アカウントがありませんか？ <a href="/signup" className="text-blue-500 underline">新規登録</a>
        </p>
      </div>
    </div>
  );
}