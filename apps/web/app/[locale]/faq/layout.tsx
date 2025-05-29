import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-rows-[1fr_auto] min-h-screen w-full fancy-overlay'>
      <Header className='fixed top-0 left-0 right-0 mb-0 lg:mb-0 mx-auto z-110 bg-transparent' />
      {children}
      <Footer />
    </div>
  );
}
