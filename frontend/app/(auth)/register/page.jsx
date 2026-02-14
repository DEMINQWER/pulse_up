"use client";

import { useState } from "react";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      await register(email, password);
      router.push("/feed");
    } catch (err) {
      setError("Ошибка регистрации");
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleRegister} style={styles.card} noValidate>
        <h1 style={styles.title}>Создать аккаунт</h1>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Повторите пароль"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f0f1a, #1a1a2e)",
  },

  card: {
    width: "320px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 40px rgba(0, 0, 255, 0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "10px",
  },

  input: {
    height: "40px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "0 12px",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    height: "40px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #4e73df, #1cc88a)",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },

  error: {
    color: "#ff4d4f",
    textAlign: "center",
    fontSize: "14px",
  },
};