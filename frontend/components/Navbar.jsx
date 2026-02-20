"use client"

export default function Navbar({ onMenuClick }) {
  return (
    <div className="navbar">
      <button onClick={onMenuClick} style={{marginRight: 15}}>
        ☰
      </button>
      <div style={{fontWeight: 600}}>PULSE</div>
    </div>
  )
}