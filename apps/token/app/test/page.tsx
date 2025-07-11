'use client';

import Editor from '@/components/Editor';
import { FormInput } from '@mjs/ui/primitives/form-input';
import { useAppForm } from '@mjs/ui/primitives/form/index';

export default function Page() {
  const form = useAppForm({
    defaultValues: {
      test: 'test',
    },
  });
  const initialText = 'Type your notification message here...';

  return (
    <form.AppForm>
      <form className='grid place-items-center h-screen w-screen gap-4 grid-cols-1'>
        <div className='w-full max-w-md'>
          <FormInput name='test' type='date' />
        </div>
        <div className='relative min-h-[500px] w-full max-w-md bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg border-2 border-black'>
          <Editor
            className='prose bg-white text-black h-full border-none!'
            initialValue={{
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: initialText,
                    },
                  ],
                },
              ],
            }}
            onChange={(value) => {
              console.log('body', value);
            }}
          />
        </div>
      </form>
    </form.AppForm>
  );
}
