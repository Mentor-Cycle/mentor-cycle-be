import { ErrorCode } from './error-code.type';

export interface DomainError<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMetadata extends Record<string, any> | undefined = undefined,
> {
  readonly name: string;
  readonly code: ErrorCode;
  readonly metadata?: TMetadata;
}
