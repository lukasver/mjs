import { Button } from '../primitives/button';
import { Icons } from './icons';

export type SocialFooterProps = {
  config: Partial<{
    twitter: string;
    instagram: string;
    tiktok: string;
    discord: string;
    github: string;
    linkedin: string;
    youtube: string;
    facebook: string;
    threads: string;
    mastodon: string;
  }>;
};

/**
 * Socials for the footer
 */
export const SocialFooter = ({ config }: SocialFooterProps) => {
  return (
    <div className='mb-3 flex flex-wrap justify-center gap-4'>
      {config.twitter && (
        <a href={config.twitter}>
          <Button variant='ghost' size='icon' aria-label='𝕏 (formerly Twitter)'>
            <Icons.xTwitter className='w-5 h-5' />
          </Button>
        </a>
      )}

      {config.instagram && (
        <a href={config.instagram}>
          <Button variant='ghost' size='icon' aria-label='Instagram'>
            <Icons.instagram className='w-5 h-5' />
          </Button>
        </a>
      )}

      {config.tiktok && (
        <a href={config.tiktok}>
          <Button variant='ghost' size='icon' aria-label='TikTok'>
            <Icons.tiktok className='w-5 h-5' />
          </Button>
        </a>
      )}

      {config.github && (
        <a href={config.github}>
          <Button variant='ghost' size='icon' aria-label='GitHub'>
            <Icons.github className='w-6 h-6' />
          </Button>
        </a>
      )}

      {config.discord && (
        <a href={config.discord}>
          <Button variant='ghost' size='icon' aria-label='Discord'>
            <Icons.discord className='w-6 h-6' />
          </Button>
        </a>
      )}

      {config.linkedin && (
        <a href={config.linkedin}>
          <Button variant='ghost' size='icon' aria-label='LinkedIn'>
            <Icons.linkedin className='w-6 h-6' />
          </Button>
        </a>
      )}

      {config.youtube && (
        <a href={config.youtube}>
          <Button variant='ghost' size='icon' aria-label='YouTube'>
            <Icons.youtube className='w-7 h-7' />
          </Button>
        </a>
      )}

      {config.facebook && (
        <a href={config.facebook}>
          <Button variant='ghost' size='icon' aria-label='Facebook'>
            <Icons.facebook className='w-6 h-6' />
          </Button>
        </a>
      )}

      {config.threads && (
        <a href={config.threads}>
          <Button variant='ghost' size='icon' aria-label='Threads'>
            <Icons.threads className='w-6 h-6' />
          </Button>
        </a>
      )}

      {config.mastodon && (
        <a href={config.mastodon}>
          <Button variant='ghost' size='icon' aria-label='Mastodon'>
            <Icons.boxes className='w-6 h-6' />
          </Button>
        </a>
      )}
    </div>
  );
};
