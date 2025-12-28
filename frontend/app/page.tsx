'use client'; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Backend(3001)のデフォルトAPIを叩く
    fetch('http://localhost:3001')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">通信テスト</h1>
      <p className="mt-4 text-xl">
        Backendからの返事: <span className="text-red-500">{message}</span>
      </p>
    </main>
  );
}