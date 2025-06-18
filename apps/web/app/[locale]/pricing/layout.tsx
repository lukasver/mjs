import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Not implemented yet
  notFound();
  return (
    <div className='flex flex-col w-full items-center fancy-overlay'>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
