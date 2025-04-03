import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Chat Assistant",
  description: "An intelligent chat assistant powered by AI",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
