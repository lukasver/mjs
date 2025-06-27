'use client';

import { LoginSchema } from '@/common/schemas/login';
import { signIn, signUp } from '@/lib/actions';
import { useActionListener } from '@mjs/ui/hooks/use-action-listener';
import { cn } from '@mjs/ui/lib/utils';
import { Button } from '@mjs/ui/primitives/button';
import { FormInput } from '@mjs/ui/primitives/form-input';
import { Separator } from '@mjs/ui/primitives/separator';
import { useAppForm } from '@mjs/ui/primitives/tanstack-form';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ConnectWallet2 } from './connect-wallet';

export function LoginForm({ className }: { className?: string }) {
  const [state, setState] = useState<'login' | 'signup'>('login');
  const router = useRouter();
  const { execute: executeSignIn, isPending: isSignInPending } =
    useActionListener(useAction(signIn), {
      onSuccess: (d) => {
        console.log('ACAAAA', d);
        router.push('/onboarding');
      },
      successMessage: 'Login successful',
    });
  const { execute: executeSignUp, isPending: isSignUpPending } =
    useActionListener(useAction(signUp));

  const form = useAppForm({
    validators: { onSubmit: LoginSchema },
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: ({ value }) =>
      state === 'login' ? executeSignIn(value) : executeSignUp(value),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const loading = isSignInPending || isSignUpPending;

  return (
    <form.AppForm>
      <form
        onSubmit={handleSubmit}
        className={cn(className, 'flex flex-col gap-4 max-w-[300px]')}
      >
        <FormInput
          name='username'
          type='email'
          label='Username'
          inputProps={{
            autoComplete: 'username',
          }}
        />
        <FormInput
          name='password'
          type='password'
          label='Password'
          inputProps={{
            autoComplete: 'current-password',
          }}
        />
        <Button variant='accent' type='submit' loading={loading}>
          {state === 'login' ? 'Log in' : 'Sign up'}
        </Button>
        <Separator />
        <Button
          disabled={loading}
          type='button'
          variant={'link'}
          className='text-sm cursor-pointer bg-white/10 backdrop-blur-3xl hover:bg-white/20'
          onClick={() => setState(state === 'login' ? 'signup' : 'login')}
        >
          {state === 'login' ? 'Sign up' : 'Log in'}
        </Button>
        <ConnectWallet2 />
      </form>
    </form.AppForm>
  );
}
