import "./globals.css"
import Sidebar from "../components/Sidebar"

export const metadata = {
  title: "Pulse",
  description: "Messenger App"
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>

        {/* SIDEBAR + TOPBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="main-content">
          {children}
        </div>

      </body>
    </html>
  )
}