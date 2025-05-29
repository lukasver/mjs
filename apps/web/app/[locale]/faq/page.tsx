import { createFaqJsonLd, JsonLd } from '@/components/JsonLd';
import { LandingFaqCollapsibleSection } from '@/components/landing';
import { cn } from '@mjs/ui/lib/utils';
import { getTranslations } from 'next-intl/server';

export default async function FaqPage() {
  const t = await getTranslations('Faq');

  // const len = Object.keys(t('items')).length;
  const len = Array.from({ length: 10 });
  const faqItems = len.map((_, i) => ({
    question: t(`items.${i}.question`),
    answer: t(`items.${i}.answer`),
  }));

  return (
    <main className='mt-20 container mx-auto grid place-items-center min-h-[70dvh]'>
      <LandingFaqCollapsibleSection
        title={t('title')}
        description={t('description')}
        faqItems={faqItems}
        // withBackground
      />
      <div
        className={cn(
          'w-full h-full absolute inset-0 bg-repeat -z-1 bg-[url(/static/images/bg2.webp)]',
          'gradient-y-primary',
          'after:absolute after:inset-0 after:bg-gradient-to-t after:from-primary/80 after:from-5% after:to-transparent'
        )}
      />
      <JsonLd
        jsonLd={createFaqJsonLd(
          faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          }))
        )}
      />
    </main>
  );
}
