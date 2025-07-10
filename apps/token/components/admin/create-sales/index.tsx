'use client';

import { useInputOptionsContext } from '@/components/hooks/use-input-options';
import { Stepper } from '@/components/stepper';
import {
  AnimatePresence,
  FadeAnimation,
  motion,
} from '@mjs/ui/components/motion';
import { cn } from '@mjs/ui/lib/utils';
import { Button } from '@mjs/ui/primitives/button';
import { FormInput } from '@mjs/ui/primitives/form-input';
import {
  UseAppForm,
  useAppForm,
  useFormContext,
} from '@mjs/ui/primitives/form/index';
import { useTranslations } from 'next-intl';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { FormSchema, formSchemaShape, InputProps } from './utils';

const getInputProps = (
  key: keyof typeof formSchemaShape,
  t: ReturnType<typeof useTranslations>
) => {
  const inputProps = InputProps[key];
  return {
    name: key,
    type: inputProps.type,
    label: t(`${key}.label`),
    description: t(`${key}.description`),
    optionKey: inputProps.optionKey,
    props: inputProps.inputProps || {},
  };
};

const steps = [
  { id: 1, name: 'Create', description: 'Basic information' },
  { id: 2, name: 'Contract', description: 'Contract details' },
  { id: 3, name: 'Additional Information', description: 'Final details' },
];

export const CreateSaleForm = () => {
  const form = useAppForm({
    validators: { onSubmit: FormSchema },
    defaultValues: {},
    onSubmit: ({ value }) => console.log(value),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit}>
        <FadeAnimation delay={0.1} duration={0.5}>
          <FormStepper />
          <SectionContainer title='Token Information' className='col-span-2'>
            <SectionForm />
            <FormFooter />
          </SectionContainer>
        </FadeAnimation>
      </form>
    </form.AppForm>
  );
};

const SectionContainer = ({
  children,
  title = 'Create a New Sale',
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col gap-6 justify-center', className)}>
      <h3 className='text-2xl font-bold text-primary-foreground text-center md:text-left font-heading'>
        {title}
      </h3>
      {children}
    </div>
  );
};

const FormStepper = ({ className }: { className?: string }) => {
  const [step, setStep] = useQueryState(
    'step',
    parseAsInteger.withDefault(1).withOptions({ shallow: true })
  );
  return (
    <Stepper
      currentStep={step}
      steps={steps}
      className={className}
      onStepClick={setStep}
    />
  );
};

const SectionForm = ({ children }: { children?: React.ReactNode }) => {
  const [step] = useQueryState(
    'step',
    parseAsInteger.withDefault(1).withOptions({ shallow: true })
  );

  if (!step) return null;
  return (
    <div className='flex flex-col gap-4 min-h-[600px] h-full'>
      <AnimatePresence>
        {step === 1 && <TokenInformation key={1} />}
        {step === 2 && <SaftInformation key={2} />}
        {step === 3 && <ProjectInformation key={3} />}
      </AnimatePresence>
    </div>
  );
};

const animation = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
};

const TokenInformation = () => {
  const t = useTranslations('admin.sales.create.basic');
  const { options } = useInputOptionsContext();

  return (
    <motion.div {...animation}>
      <h1>Basic Information</h1>
      <ul className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {Object.keys(formSchemaShape).map((key) => {
          const { name, type, label, description, props, optionKey } =
            getInputProps(key as keyof typeof formSchemaShape, t);
          if (optionKey && options) {
            props.options = options[optionKey as keyof typeof options];
          }
          return (
            <li key={key} className=''>
              <FormInput
                name={name}
                type={type}
                label={label}
                description={description}
                message={true}
                inputProps={props}
              />
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};

const SaftInformation = () => {
  return (
    <motion.div {...animation}>
      <h1>Basic Information</h1>
    </motion.div>
  );
};

const ProjectInformation = () => {
  return (
    <motion.div {...animation}>
      <h1>Basic Information</h1>
    </motion.div>
  );
};

const FormFooter = () => {
  const [step, setStep] = useQueryState(
    'step',
    parseAsInteger.withDefault(1).withOptions({ shallow: true })
  );
  // https://github.com/TanStack/form/discussions/1335#discussioncomment-12685109
  const form = useFormContext() as unknown as UseAppForm;

  return (
    <div className='flex justify-between w-full'>
      <Button
        className={cn(step === 1 && 'invisible pointer-events-none')}
        variant='outline'
        type={'button'}
        onClick={() => setStep(step - 1)}
      >
        Back
      </Button>
      <form.SubmitButton className='min-w-32'>
        {step === steps.length - 1 ? 'Finish' : 'Next'}
      </form.SubmitButton>
    </div>
  );
};
