import "./styles/globals.css"

export const metadata = {
  title: "Pulse",
  description: "Messenger App"
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>

        {/* TOPBAR */}
        <div className="topbar">
          <div className="logo">PULSE</div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
          {children}
        </div>

      </body>
    </html>
  )
}