export type InputTypes =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'email'
  | 'url'
  | 'address'
  | 'checkbox'
  | 'currency'
  | 'phone'
  | 'country'
  | 'file'
  | 'textarea'
  | 'switch'
  | 'autocomplete'
  | 'password'
  | 'calendar'
  | 'json';

export type SelectOption = {
  value: string | number | boolean | null;
  label: string;
  disabled?: boolean;
};
