"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUser);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="page">
      <h2>{user.nickname}</h2>
      <p>@{user.username}</p>
    </div>
  );
}