import { cn } from '@mjs/ui/lib/utils';
import {
  CardContent,
  CardDescription,
  CardTitle,
} from '@mjs/ui/primitives/card';
import { Card, CardHeader } from '@mjs/ui/primitives/card';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export const IngameFeatures = async () => {
  const t = await getTranslations('GameFeatures.features');
  const features = [
    'stayInGame',
    'trainableAI',
    'collectCharacters',
    'bringFriends',
  ] as const;

  return (
    <div className='grid grid-cols-4 gap-4'>
      {features.map((feature, i) => {
        return (
          <FeatureCard
            key={feature}
            title={t(`${feature}.title`)}
            description={t(`${feature}.description`)}
            image={`/static/images/features${i + 1}.png`}
          />
        );
      })}
    </div>
  );
};

const FeatureCard = ({
  className,
  title,
  description,
  image,
}: {
  className?: string;
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <Card className={cn('glassy text-foreground flex flex-col', className)}>
      <CardHeader className='shrink-0 aspect-square grid place-items-center'>
        <picture className='[&>img]:cool-shadow'>
          <Image
            src={image}
            alt={'Feature character image'}
            width={200}
            height={200}
            className='object-cover'
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, .25))',
            }}
          />
        </picture>
      </CardHeader>
      <CardContent className='space-y-2 flex-1'>
        <CardTitle className='text-3xl font-bold font-common text-center'>
          {title}
        </CardTitle>
        <CardDescription className='text-center text-lg font-common font-base'>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
