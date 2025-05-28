'use client';

import { Button } from '@mjs/ui/primitives/button';
import { FormInput } from '@mjs/ui/primitives/form-input';
import { useCallback, useState, useTransition } from 'react';

import { Toaster, toast } from '@mjs/ui/primitives/sonner';
import { useAppForm } from '@mjs/ui/primitives/tanstack-form';
// import { submitContactForm } from '@/lib/actions';
import * as z from 'zod';
import { useRouter } from '@/lib/i18n/navigation';
import { Dialog } from '@mjs/ui/primitives/dialog';

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

const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
    startTransition(async () => {
      try {
        const result = { success: false }; // await submitContactForm(values);

        if (result.success) {
          toast.success('Message sent!', {
            description:
              "Thank you for your message. We'll get back to you soon.",
          });
          form.reset();
        } else {
          toast.error('Something went wrong. Please try again.', {
            description:
              // @ts-expect-error fixme
              result.error || 'Something went wrong. Please try again.',
          });
        }
      } catch (error: unknown) {
        toast.error('Something went wrong. Please try again.', {
          description:
            error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again.',
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

      <form.AppForm>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <FormInput
              name='name'
              type='text'
              label='Name'
              inputProps={{
                placeholder: 'Tony Kong',
              }}
            />
            <FormInput
              name='email'
              type='email'
              label='Email'
              inputProps={{
                placeholder: 'tony@mahjongstars.com',
              }}
            />
          </div>
          <FormInput
            name='subject'
            type='text'
            label='Subject'
            inputProps={{
              placeholder: "What's this about?",
            }}
          />
          <FormInput
            name='message'
            type='textarea'
            label='Message'
            placeholder='Tell us more about your inquiry...'
            inputProps={{
              placeholder:
                'I would love to learn more about your mahjong game and how I can get involved!',
            }}
          />

          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/')}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending} className='flex-1'>
              Send Message
            </Button>
          </div>
        </form>
      </form.AppForm>
    </>
  );
};

const ContactFormModal = ({
  children,
  initialOpen = true,
}: {
  children: React.ReactNode;
  initialOpen?: boolean;
}) => {
  const [open, setOpen] = useState(initialOpen);
  const router = useRouter();
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      router.push('/');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
};
export { ContactForm, ContactFormModal };
