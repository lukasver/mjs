'use client';

import { SaftEditor } from '@/components/admin/saft-editor';
import { Button } from '@mjs/ui/primitives/button';
import { useAppForm } from '@mjs/ui/primitives/form/index';
import { useCallback } from 'react';
import { createSaftContract } from '@/lib/actions';
import { useAction } from 'next-safe-action/hooks';
import { z } from 'zod';

const FormSchema = z.object({
  content: z.coerce.string(),
  name: z.string().trim(),
  description: z.string().trim(),
  saleId: z.string().trim(),
});

export default function Page() {
  const { execute, result, isExecuting } = useAction(createSaftContract);

  console.debug('🚀 ~ page.tsx:21 ~ result:', result);

  // const [state, action] = useActionState(createSaftContract, initialFormState);

  const form = useAppForm({
    validators: { onSubmit: FormSchema },
    defaultValues: {
      content: '',
      name: '',
      description: '',
      saleId: 'cmcyrf1kt000r8o72ess9y14u',
    },
    onSubmit: ({ value }) => {
      console.log('VALL', value);
      execute(value);
    },
    // transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  const initialText = 'Type your notification message here...';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <div className='container mx-auto'>
      <form.AppForm>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='max-w-lg'>
            <SaftEditor saleId={undefined} placeholder={initialText} />
            <div className='flex justify-end'>
              <Button
                className='w-full'
                loading={isExecuting}
                type='submit'
                onClick={() => {
                  const content = form.getFieldValue('content');
                  console.log(content);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </form.AppForm>
    </div>
  );
}
{
  /* <div className='w-full max-w-md'>
          <FormInput name='test' type='date' />
        </div> */
}
