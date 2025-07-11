'use client';
import {
  UseAppForm,
  useFormContext,
  type AnyFieldApi,
} from '@mjs/ui/primitives/form';
import { Label } from '@mjs/ui/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mjs/ui/primitives/select';
import { Time } from '@mjs/ui/components/time';
import { DateTime } from 'luxon';
import { useSaleSaft } from '@/lib/services/api';
import { useState } from 'react';
import {
  EditorInstance,
  JSONContent,
} from '@mjs/ui/components/editor/advanced-editor';
import Editor from '../Editor';
import { SaftContract } from '@/common/schemas/generated';
import { safeJsonParse } from '@mjs/utils/client';

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}

interface SaftEditorProps {
  saleId?: string;
  placeholder?: string;
  className?: string;
}
export function SaftEditor({
  saleId,
  placeholder,
  className,
}: SaftEditorProps) {
  const { data, isLoading } = useSaleSaft(saleId);

  const versions = data?.versions || [];
  const saft: SaftContract | null = data?.saft || null;

  const form = useFormContext() as unknown as UseAppForm;

  const [editor, setEditor] = useState<EditorInstance | null>(null);
  const [selectValue, setSelectValue] = useState<string | undefined>(
    saft?.name
  );

  const handleVersionChange = (id: string) => {
    const v = versions.find((c) => c.id === id);
    if (!v) return;
    if (v && v.content) {
      const content =
        typeof v.content === 'string'
          ? safeJsonParse(v.content)
          : (v.content as JSONContent[]);
      form.setFieldValue('content', content);
      editor?.commands.setContent(content);
    }
    setSelectValue(v.id);
    //TODO! call API to update current version
    // updateTermsAndConditionsConfig({
    //   uid: config.uid,
    //   type: 'TERMS_AND_CONDITIONS',
    //   content: config.content,
    //   updatedAt: DateTime.now().toJSDate(),
    // });
  };

  return (
    <>
      {versions?.length > 0 ? (
        <div className='space-y-2'>
          <Label htmlFor='version-config'>Select active version</Label>
          <Select value={selectValue} onValueChange={handleVersionChange}>
            <SelectTrigger id='version-config' className='bg-background'>
              <SelectValue placeholder='Create a new version' />
            </SelectTrigger>
            <SelectContent>
              {versions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <p className='flex items-center justify-between gap-2'>
                    <span className='text-sm'>{c.name}</span>
                    <Time
                      className='text-xs text-muted-foreground'
                      date={c.createdAt}
                      format={DateTime.DATETIME_FULL}
                    />
                  </p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <form.Field
        name='content'
        // biome-ignore lint/correctness/noChildrenProp: <explanation>
        children={(field) => {
          return (
            <>
              <Label className='mb-1'>Create new version</Label>
              <div className='relative min-h-[500px] w-full h-full bg-white sm:rounded-lg sm:shadow-lg border-2 border-black'>
                <Editor
                  setEditor={setEditor}
                  className='prose bg-white text-black h-full border-none!'
                  output='json'
                  onChange={(value) => {
                    field.handleChange(value as JSONContent);
                  }}
                  initialValue={{
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: placeholder,
                          },
                        ],
                      },
                    ],
                  }}
                />
                <FieldInfo field={field} />
              </div>
            </>
          );
        }}
      />
    </>
  );
}
