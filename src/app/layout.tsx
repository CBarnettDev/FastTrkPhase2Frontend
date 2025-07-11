
import "@ant-design/v5-patch-for-react-19";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FastTrk AI",
  icons: {
    icon: "/logo.svg",  
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <div className="absolute top-0 left-0 w-full flex justify-center pt-4"></div>
        {children}
      </body>
    </html>
  );
}
