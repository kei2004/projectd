'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // roleの初期値は 'student'
  const [role, setRole] = useState('student');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/auth/signup', {
        username,
        password,
        role,
      });
      alert('登録完了！ログインしてください。');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('登録に失敗しました。ユーザー名が既にあるかも？');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">新規登録</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          
          <label className="font-bold text-sm">ユーザー名</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="font-bold text-sm">パスワード</label>
          <input
            type="password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ▼▼▼ 役割選択 ▼▼▼ */}
          <label className="font-bold text-sm mt-2">利用目的は？</label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={(e) => setRole(e.target.value)}
              />
              習いたい (生徒)
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === 'teacher'}
                onChange={(e) => setRole(e.target.value)}
              />
              教えたい (講師)
            </label>
          </div>
          {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-4 font-bold">
            アカウント作成
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          すでにアカウントをお持ちですか？ <a href="/login" className="text-blue-500 underline">ログイン</a>
        </p>
      </div>
    </div>
  );
}