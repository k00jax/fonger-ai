import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '../components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'fonger.ai - Kyle Fonger',
  description: 'Kyle Fonger: AI, philosophy, building things. Founder of Trivance AI. Author. Father of three.',
  metadataBase: new URL('https://fonger.ai'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-gray-200 antialiased`}>
        <NavBar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
