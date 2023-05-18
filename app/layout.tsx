import Header from "./component/Header";
import { AuthContextProvider } from "./component/authContext";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
