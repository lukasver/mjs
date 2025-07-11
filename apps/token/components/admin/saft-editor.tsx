'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@mjs/ui/primitives/card';
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
import { cn } from '@mjs/ui/lib/utils';
import Editor from '../Editor';
import { SaftContract } from '@/common/schemas/generated';

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
}
export function SaftEditor({ saleId, placeholder }: SaftEditorProps) {
  const { data, isLoading } = useSaleSaft(saleId);

  const versions = data?.versions || [];
  const saft: SaftContract | null = data?.saft || null;

  const onSubmitNda = (values) => {
    const content =
      values.type === 'text' ? JSON.stringify(values.content) : values.link;
    if (!content) return;
    // executeAsync({
    //   content,
    //   type: 'TERMS_AND_CONDITIONS',
    // }).then((r) => {
    //   if (r?.data) {
    //     setSelectValue(r.data.uid);
    //     if (!isValidUrl(r.data.content)) {
    //       const content = JSON.parse(r.data.content) as JSONContent[];
    //       form.setValue('content', content);
    //       editor?.commands.setContent(content);
    //     } else {
    //       form.setValue('link', r.data.content);
    //     }
    //     toast.success('Created new version');
    //   }
    //   if (r?.serverError) {
    //     toast.error(r.serverError);
    //   }
    //   if (r?.validationErrors?._errors) {
    //     toast.error(r.validationErrors._errors.join(', '));
    //   }
    // });
    // Here you would typically make an API call to update the NDA
  };

  const form = useFormContext() as unknown as UseAppForm;

  const [editor, setEditor] = useState<EditorInstance | null>(null);
  const [selectValue, setSelectValue] = useState<string | undefined>(
    data?.name
  );

  const handleVersionChange = (id: string) => {
    const v = versions.find((c) => c.id === id);
    if (!v) return;
    if (v && v.content) {
      const content = JSON.parse(v.content) as JSONContent[];
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
    <Card className='w-fit'>
      <CardHeader>
        <CardTitle>SAFT Configuration</CardTitle>
        <CardDescription>
          Manage SAFT shown to your investors when signing up.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='max-w-md lg:max-w-2xl'>
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

          <div className={cn('')}>
            <form.Field
              name='content'
              // biome-ignore lint/correctness/noChildrenProp: <explanation>
              children={(field) => {
                return (
                  <>
                    <Label className='mb-1'>Create new version</Label>
                    <div className='relative min-h-[500px] w-full max-w-md lg:max-w-2xl bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg border-2 border-black'>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
