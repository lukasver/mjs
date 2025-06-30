import Footer from '@/components/Footer';
import React from 'react';

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className='bg-[#770205]'>
      {children}
      <Footer className='[&>div>div]:mt-0! [&>div]:my-0!' locale={locale} />
    </div>
  );
}
