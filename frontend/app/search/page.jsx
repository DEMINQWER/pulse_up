'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function Search() {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);

  async function find() {
    setUsers(await api('/search?query='+q));
  }

  return (
    <div>
      <input placeholder="Поиск..." onChange={e=>setQ(e.target.value)} />
      <button onClick={find}>Найти</button>

      {users.map(u => (
        <div key={u.id}>{u.login}</div>
      ))}
    </div>
  );
}