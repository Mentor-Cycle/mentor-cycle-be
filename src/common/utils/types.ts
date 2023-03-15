/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, any> extends Pick<T, K> ? K : never;
}[keyof T];

export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type MakeOptionalNullish<T, K extends keyof T = OptionalKeys<T>> = Omit<
  T,
  K
> & {
  [Key in K]?: T[Key] | null;
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Omit<
  T,
  Keys
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Omit<T, Keys>>;
  }[Keys];

export const isFunction = (value: any): value is () => void =>
  typeof value === 'function';
