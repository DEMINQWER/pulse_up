import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "Pulse",
  description: "Messenger App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" data-theme="pulse">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}