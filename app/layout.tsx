import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oravya Real Estate | Luxury & Investment Dubai',
  description: 'Portail immobilier de luxe et d’investissement à Dubaï.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F2EDE4] text-[#2C181A] font-sans antialiased selection:bg-[#4A151B] selection:text-[#F2EDE4]">
        {children}
      </body>
    </html>
  );
}