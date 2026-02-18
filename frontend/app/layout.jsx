import "../styles/globals.css";
import SidebarProvider from "@/components/SidebarProvider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Pulse",
  description: "Messenger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <SidebarProvider>
          <Navbar />
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}