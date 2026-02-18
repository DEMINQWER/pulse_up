"use client";

export default function Navbar({ open, setOpen }) {
  return (
    <div className="topbar">
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div className="logo">PULSE</div>
    </div>
  );
}