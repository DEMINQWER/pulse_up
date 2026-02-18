import "../styles/globals.css";
import SidebarProvider from "@/components/SidebarProvider";

export const metadata = {
  title: "Pulse",
  description: "Messenger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}