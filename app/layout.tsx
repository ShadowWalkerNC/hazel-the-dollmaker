import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hazel The Dollmaker | Handcrafted Custom Wrestling Crochet Dolls & Official Merch',
  description: 'Watcher of wrestling. Maker of dolls. 100% freehand organic crochet dolls, official merchandise, and limited wrestler drops handcrafted in Maine by Hazel (@hazel_the_dollmaker).',
  icons: {
    icon: '/hazel-logo.jpg',
  },
  openGraph: {
    title: 'Hazel The Dollmaker | Official Merchandise & Wrestling Crochet',
    description: '100% freehand organic crochet dolls, official logo apparel, and limited wrestler drops.',
    images: ['/hazel-logo.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Comfortaa:wght@600;700&family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Russo+One&display=swap"
          rel="stylesheet"
        />
        <script async src="//www.instagram.com/embed.js"></script>
      </head>
      <body className="crochet-bg min-h-screen text-gray-100 selection:bg-pink-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
