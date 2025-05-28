import { ContactForm, ContactFormModal } from '@/components/ContactForm';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@mjs/ui/primitives/dialog';

import { MessageSquare } from 'lucide-react';

export default function HomePage() {
  return (
    <ContactFormModal>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5' />
            Contact Us
          </DialogTitle>
          <DialogDescription className='text-secondary-300'>
            Send us a message and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <ContactForm />
      </DialogContent>
    </ContactFormModal>
  );
}
