'use client'; // Error boundaries must be Client Components

import { Icons } from '@mjs/ui/components/icons';
import { Button } from '@mjs/ui/primitives/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* Header matching the Mahjong Stars branding */}
      <header className='bg-red-900 text-white px-6 py-4'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div className='flex items-center space-x-2'>
            <h1 className='text-xl font-bold'>Mahjong Stars</h1>
          </div>
        </div>
      </header>

      {/* Main error content */}
      <div className='flex flex-col lg:flex-row max-w-7xl mx-auto'>
        {/* Sidebar */}
        <aside className='w-full lg:w-64 bg-stone-200 min-h-screen p-6'>
          <div className='space-y-4'>
            <div className='text-sm font-medium text-stone-700'>Docs Theme</div>
            <nav className='space-y-2'>
              <a
                href='/docs'
                className='block text-stone-600 hover:text-red-900 transition-colors'
              >
                About Mahjong Stars
              </a>
              <a
                href='/docs/game'
                className='block text-stone-600 hover:text-red-900 transition-colors'
              >
                The Game
              </a>
              <a
                href='/docs/tokenomics'
                className='block text-stone-600 hover:text-red-900 transition-colors'
              >
                Tokenomics
              </a>
            </nav>
          </div>
        </aside>

        {/* Error content */}
        <main className='flex-1 p-6 lg:p-12'>
          <div className='max-w-2xl mx-auto text-center'>
            <div className='mb-8'>
              <Icons.alertTriangle className='w-16 h-16 text-red-900 mx-auto mb-4' />
              <h1 className='text-3xl font-bold text-red-900 mb-4'>
                Something went wrong!
              </h1>
              <p className='text-stone-600 text-lg mb-6'>
                We encountered an unexpected error while loading this page.
                Don't worry, our team has been notified and we're working to fix
                it.
              </p>
            </div>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className='bg-stone-100 border border-stone-300 rounded-lg p-4 mb-8 text-left'>
                <h3 className='font-semibold text-red-900 mb-2'>
                  Error Details:
                </h3>
                <code className='text-sm text-stone-700 break-all'>
                  {error.message}
                </code>
                {error.digest && (
                  <p className='text-xs text-stone-500 mt-2'>
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                onClick={reset}
                className='bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-lg flex items-center gap-2'
              >
                <Icons.refreshCw className='w-4 h-4' />
                Try Again
              </Button>

              <Button
                variant='outline'
                className='border-red-900 text-red-900 hover:bg-red-50 px-6 py-3 rounded-lg flex items-center gap-2'
                onClick={() => window.history.back()}
              >
                <Icons.arrowLeft className='w-4 h-4' />
                Go Back
              </Button>

              <Button
                variant='outline'
                className='border-red-900 text-red-900 hover:bg-red-50 px-6 py-3 rounded-lg flex items-center gap-2'
                onClick={() => (window.location.href = '/')}
              >
                <Icons.home className='w-4 h-4' />
                Home Page
              </Button>
            </div>

            {/* Additional help text */}
            <div className='mt-12 p-6 bg-stone-100 rounded-lg'>
              <h3 className='font-semibold text-red-900 mb-2'>Need Help?</h3>
              <p className='text-stone-600 text-sm'>
                If this problem persists, please contact our support team or
                check our status page for any ongoing issues.
              </p>
            </div>
          </div>
        </main>

        {/* Right sidebar - On This Page */}
        <aside className='hidden xl:block w-64 p-6'>
          <div className='space-y-4'>
            <div className='text-sm font-medium text-stone-700'>
              On This Page
            </div>
            <nav className='space-y-2 text-sm'>
              <a
                href='#error-details'
                className='block text-stone-600 hover:text-red-900 transition-colors'
              >
                Error Details
              </a>
              <a
                href='#recovery-options'
                className='block text-stone-600 hover:text-red-900 transition-colors'
              >
                Recovery Options
              </a>
              <a
                href='#get-help'
                className='block text-stone-600 hover:text-red-900 transition-colors'
              >
                Get Help
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
