'use client';

import { FormInput } from '@mjs/ui/primitives/form-input';
import { useAppForm } from '@mjs/ui/primitives/form/index';

export default function Page() {
  const form = useAppForm({
    defaultValues: {
      test: 'test',
    },
  });
  return (
    <form.AppForm>
      <form className='grid place-items-center h-screen w-screen'>
        <div className='w-full max-w-md'>
          <FormInput name='test' type='date' />
        </div>
      </form>
    </form.AppForm>
  );
}
