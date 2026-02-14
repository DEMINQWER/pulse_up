import "../styles/globals.css";
import SidebarProvider from "@/components/SidebarProvider";

export const metadata = {
  title: "PULSE",
  description: "Next generation messenger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}