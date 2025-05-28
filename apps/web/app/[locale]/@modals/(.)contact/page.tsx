'use client';

import { ContactForm } from '@/components/ContactForm';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@mjs/ui/primitives/dialog';
import { MessageSquare } from 'lucide-react';
import { ReactNode, useState } from 'react';

function ModalPage() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      router.back();
    }
  };

  return (
    <FixModalCloseBug expectedPath='/contact'>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='px-0 pb-0 max-w-[95%] md:max-w-lg rounded-xl'>
          <DialogHeader className='px-4'>
            <DialogTitle className='flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              Contact Us
            </DialogTitle>
            <DialogDescription className='text-secondary-300'>
              Send us a message and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className='rounded-b-xl bg-[url(/static/images/bg2.webp)] bg-cover bg-center'>
            <div className='h-full w-full px-4 py-8 bg-gradient-to-b from-primary to-5% to-transparent'>
              <ContactForm />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </FixModalCloseBug>
  );
}

const FixModalCloseBug = ({
  expectedPath,
  children,
}: {
  expectedPath: string | RegExp;
  children: ReactNode;
}) => {
  const pathname = usePathname();

  if (expectedPath instanceof RegExp) {
    if (expectedPath.test(pathname)) {
      return children;
    }
    return null;
  } else if (pathname.includes(expectedPath)) {
    return children;
  }
  return null;
};

export default ModalPage;
