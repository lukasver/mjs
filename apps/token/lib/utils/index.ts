import { HttpStatus } from '@/common/enums/statusCode';

export const checkApiErrorResponse = (status) => {
  if (
    status === HttpStatus.CONFLICT ||
    status === HttpStatus.NOT_ACCEPTABLE ||
    status === HttpStatus.INTERNAL_SERVER_ERROR ||
    status === HttpStatus.NOT_FOUND ||
    status === HttpStatus.UNPROCESSABLE_ENTITY
  )
    return true;
  return false;
};

export const checkApiSuccessResponse = (status) => {
  if (status === HttpStatus.OK || status === HttpStatus.CREATED) return true;
  return false;
};

export const GET_UNHANDLED_ERROR = 'Oops something went wrong';

export const convertCapitalizedCase = (value) => {
  return value
    .split(' ')
    .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
};

export function convertToSlug(inputString) {
  return inputString?.toLowerCase().replace(/\s+/g, '-');
}

export const generateRandomKey = () => {
  return Date.now() + Math.random().toFixed(0);
};

export const generateRandomToken = () => {
  const min = 100000;
  const max = 999999;
  const randomNumber = Math.floor(min + Math.random() * (max - min + 1));
  return randomNumber.toString();
};

export function stringAvatar(name?: string) {
  const initials = name
    ?.split(' ')
    ?.map((word) => word[0].toUpperCase())
    ?.join('');

  return {
    children: initials,
  };
}

// export function formatChipMessage(message) {
//   const capitalizedMessage = message
//     .toLowerCase()
//     .replace(/\b\w/g, (c) => c.toUpperCase());

//   const formattedMessage = capitalizedMessage.replace(/_/g, ' ');
//   return formattedMessage;
// }

// export const onInvalid: SubmitErrorHandler<FieldValues> = (
//   errors: unknown
// ): void => {
//   if (IS_DEVELOPMENT || IS_STAGE_SERVER) {
//     console.debug(`[DEBUG]: ${inspect(errors)}`);
//   }
//   fireErrorToast(errors);
// };

// /**
//  * This function fires an error toast with a message.
//  * @param error en error string message
//  * @param options ToastOptions, severity and/or async toast reference
//  */
// export const fireErrorToast = async (
//   error: string | Error | unknown,
//   options?: ToastOptions & {
//     severity?: LogSeverity;
//     async?: ReactText;
//     mute?: boolean;
//   }
// ): Promise<void> => {
//   let message: string | undefined = undefined;
//   if (error instanceof Error) {
//     message = error.message || GET_UNHANDLED_ERROR;
//   }

//   if (error instanceof ZodError) {
//     message = error.issues.map((e) => e.message).join('\n');
//   }

//   if (error instanceof AxiosError) {
//     message = error.response?.data?.message ?? error.message;
//   }

//   if (error && typeof error === 'object' && !message) {
//     message = JSON.stringify(error);
//   }

//   if (typeof error === 'string') {
//     message = error;
//   }

//   if (options?.async) {
//     toast.update(options.async, {
//       render: message,
//       type: 'error',
//       isLoading: false,
//       autoClose: 2000,
//       closeOnClick: true,
//     });
//   } else {
//     if (options?.mute) {
//       return;
//     }
//     toast.error(message, options);
//   }
// };

export const getShortAddress = (str: string) => {
  if (!str) return '';
  return str.substring(0, 5) + '...' + str.slice(-4);
};
