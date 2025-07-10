'use client';

import { FIAT_CURRENCIES } from '@/common/config/constants';
import { FormInput } from '@mjs/ui/primitives/form-input';
import { useAppForm } from '@mjs/ui/primitives/form/index';

export default function Page() {
  const form = useAppForm({
    defaultValues: {
      test: 'test',
    },
  });
  console.log(form.state.values);
  return (
    <form.AppForm>
      <form className='grid place-items-center h-screen w-screen'>
        <div className='w-full max-w-md'>
          <FormInput
            name='test'
            type='select'
            inputProps={{
              options: FIAT_CURRENCIES.map((option) => ({
                label: option,
                value: option,
              })),
            }}
          />
        </div>
      </form>
    </form.AppForm>
  );
}
