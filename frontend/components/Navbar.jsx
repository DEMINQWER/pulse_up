"use client";

export default function Navbar({ open, setOpen }) {
  return (
    <nav className="navbar">
      <div className="left">
        <div
          className="menu-btn"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>
        <div className="logo">PULSE</div>
      </div>

      <div className="right"></div>

      <style jsx>{`
        .navbar {
          height: 60px;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
        }

        .left {
          display: flex;
          align-items: center;
        }

        .menu-btn {
          font-size: 22px;
          margin-right: 20px;
          cursor: pointer;
          transition: 0.2s;
        }

        .menu-btn:hover {
          color: var(--accent);
        }

        .logo {
          font-weight: bold;
          font-size: 20px;
          background: linear-gradient(90deg, var(--accent), var(--accent-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </nav>
  );
}