import { Locale } from '@/lib/i18n';
import Link from 'next/link';
import { Banner as BannerComponent } from 'nextra/components';
import Icon from '@/public/static/favicons/favicon-48x48.png';
import Image from 'next/image';

export const Banner = ({ lang }: { lang: Locale }) => {
  return (
    <BannerComponent storageKey='mjs-key' dismissible>
      <div className='flex items-center gap-2 justify-center'>
        <Image
          blurDataURL={Icon.blurDataURL}
          priority
          src={Icon.src}
          alt='MJS Token'
          width={20}
          height={20}
        />
        <Link
          href={`/web/${lang && lang !== 'en' ? `${lang}/` : ''}#newsletter`}
        >
          $MJS Token is coming soon 🚀
        </Link>
      </div>
    </BannerComponent>
  );
};
