import { createFormHook } from '@tanstack/react-form';
import {
  FormLabel,
  fieldContext,
  formContext,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem,
  useFormContext,
  useFieldContext,
} from './tanstack-form';
import { SubmitButton } from './buttons';

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem,
  },
  formComponents: {
    SubmitButton,
  },
});

type UseAppForm = ReturnType<typeof useAppForm>;

export {
  useAppForm,
  useFormContext,
  useFieldContext,
  withForm,
  type UseAppForm,
};
