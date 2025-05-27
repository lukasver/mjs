'use client';

import { useCallback, useState, useTransition } from 'react';
import { Button } from '@mjs/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@mjs/ui/primitives/dialog';
import { FormInput } from '@mjs/ui/primitives/form-input';

import * as z from 'zod';
import { useAppForm } from '@mjs/ui/primitives/tanstack-form';
// import { submitContactForm } from '@/lib/actions';
import { Mail, MessageSquare } from 'lucide-react';
import { Toaster, toast } from '@mjs/ui/primitives/sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

export default function HomePage() {
  const [open, setOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  const form = useAppForm({
    validators: { onSubmit: formSchema },
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.debug('🚀 ~ page.tsx:62 ~ values:', values);

    startTransition(async () => {
      try {
        const result = { success: false }; // await submitContactForm(values);

        if (result.success) {
          toast.success('Message sent!', {
            description:
              "Thank you for your message. We'll get back to you soon.",
          });
          form.reset();
          setOpen(false);
        } else {
          toast.error('Something went wrong. Please try again.', {
            description:
              result.error || 'Something went wrong. Please try again.',
          });
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.', {
          description: 'Something went wrong. Please try again.',
        });
      }
    });
  }

  return (
    <>
      <Toaster
        position='top-center'
        offset={10}
        toastOptions={{ duration: 2000 }}
      />
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4'>
        <div className='max-w-2xl mx-auto text-center space-y-8'>
          <div className='space-y-4'>
            <h1 className='text-4xl font-bold text-slate-900'>
              Welcome to Our Platform
            </h1>
            <p className='text-xl text-slate-600'>
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size='lg' className='gap-2'>
                  <Mail className='h-4 w-4' />
                  Contact Us
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <MessageSquare className='h-5 w-5' />
                    Contact Us
                  </DialogTitle>
                  <DialogDescription>
                    Send us a message and we'll get back to you as soon as
                    possible.
                  </DialogDescription>
                </DialogHeader>

                <form.AppForm>
                  <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <FormInput name='name' type='text' label='Name' />
                      <FormInput
                        name='email'
                        type='email'
                        label='Email'
                        placeholder='your@email.com'
                      />
                    </div>
                    <FormInput
                      name='subject'
                      type='text'
                      label='Subject'
                      placeholder="What's this about?"
                    />
                    <FormInput
                      name='message'
                      type='textarea'
                      label='Message'
                      placeholder='Tell us more about your inquiry...'
                      // inputProps={{
                      //   resize: 'vertical',
                      // }}
                    />

                    <div className='flex gap-3 pt-4'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => setOpen(false)}
                        className='flex-1'
                      >
                        Cancel
                      </Button>
                      <Button
                        type='submit'
                        disabled={isPending}
                        className='flex-1'
                      >
                        Send Message
                      </Button>
                    </div>
                  </form>
                </form.AppForm>
              </DialogContent>
            </Dialog>

            <Button variant='outline' size='lg'>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
