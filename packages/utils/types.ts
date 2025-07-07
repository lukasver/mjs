export type Prettify<T> = {
  [K in keyof T]: T[K] extends object ? { [K2 in keyof T[K]]: T[K][K2] } : T[K];
};
