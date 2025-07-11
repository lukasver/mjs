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
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { formSchemaShape, InputProps, SaleFormSchema } from './utils';
import { SaftEditor } from '../saft-editor';
import { useAction } from 'next-safe-action/hooks';
import { createSaftContract, createSale } from '@/lib/actions/admin';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@mjs/ui/primitives/card';

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

const schemas = {
  1: SaleFormSchema,
  2: z.object({}),
  3: z.object({}),
} as const;

export const CreateSaleForm = () => {
  const [step, setStep] = useQueryState(
    'step',
    parseAsInteger.withDefault(1).withOptions({ shallow: true })
  );
  const [saleId, setSaleId] = useQueryState(
    'saleId',
    parseAsString.withDefault('')
  );

  const saleAction = useAction(createSale);
  const saftAction = useAction(createSaftContract);

  const form = useAppForm({
    validators: {
      onSubmit: schemas[step as keyof typeof schemas] || SaleFormSchema,
    },
    defaultValues: {},
    onSubmit: async ({ value }) => {
      if (step === 1) {
        //Create sale and update query params to reflect the current saleId
        const res = await saleAction.executeAsync(value);

        console.debug('🚀 ~ index.tsx:77 ~ res:', res);

        if (res?.data) {
          setSaleId(res.data.sale.id);
          // Go to next step
          setStep((pv) => pv + 1);
        }
      }
      if (step === 2) {
        // Create Saft in DB and move no the next step
        const res = await saftAction.executeAsync({
          content: value.content,
          name: value.name,
          description: value.description,
          saleId,
        });
        setStep((pv) => pv + 1);
      }
      if (step === 3) {
        //Update project information and finish
        // setStep((pv) => pv + 1);
      }
    },
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
          <SectionContainer title='Create a new sale' className='col-span-2'>
            <FormStepper />
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
    <Card>
      <Stepper
        currentStep={step}
        steps={steps}
        className={className}
        onStepClick={setStep}
      />
    </Card>
  );
};

const SectionForm = ({ children }: { children?: React.ReactNode }) => {
  const [step] = useQueryState(
    'step',
    parseAsInteger.withDefault(1).withOptions({ shallow: true })
  );
  const [saleId] = useQueryState('saleId', parseAsString.withDefault(''));

  if (!step) return null;
  return (
    <div className='flex flex-col gap-4 min-h-[500px] h-full'>
      <AnimatePresence>
        {step === 1 && <TokenInformation key={1} saleId={saleId} />}
        {step === 2 && <SaftInformation key={2} saleId={saleId} />}
        {step === 3 && <ProjectInformation key={3} saleId={saleId} />}
      </AnimatePresence>
    </div>
  );
};

const animation = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
};

const TokenInformation = ({
  saleId,
  className,
}: {
  saleId?: string;
  className?: string;
}) => {
  const t = useTranslations('admin.sales.create.basic');
  const { options } = useInputOptionsContext();

  return (
    <motion.div {...animation}>
      <CardContainer
        title='Basic Information'
        description='Manage basic information'
        className={className}
      >
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
      </CardContainer>
    </motion.div>
  );
};

const CardContainer = ({
  children,
  title,
  description,
  className,
}: {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>{children}</CardContent>
    </Card>
  );
};

const SaftInformation = ({
  saleId,
  className,
}: {
  saleId?: string;
  className?: string;
}) => {
  if (!saleId) {
    //TODO! improve
    return <div>No saleId</div>;
  }
  return (
    <motion.div {...animation}>
      <CardContainer
        title='SAFT Configuration'
        description='Manage SAFT shown to your investors when signing up.'
        className={className}
      >
        <SaftEditor
          saleId={saleId}
          placeholder={
            'Create or paste the SAFT content to generate a signeable version'
          }
        />
      </CardContainer>
    </motion.div>
  );
};

const ProjectInformation = ({
  saleId,
  className,
}: {
  saleId?: string;
  className?: string;
}) => {
  if (!saleId) {
    //TODO! improve
    return <div>No saleId</div>;
  }
  return (
    <motion.div {...animation}>
      <CardContainer
        title='Project Information'
        description='Manage project information'
        className={className}
      >
        <div>TODO</div>
      </CardContainer>
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
