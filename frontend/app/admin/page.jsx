'use client';
import { api } from '@/lib/api';

export default function Admin() {
  async function makeModerator(id) {
    await api('/admin/moderator', 'POST', { userId: id });
  }

  return <h2>Админ панель</h2>;
}