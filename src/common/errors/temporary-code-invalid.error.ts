import { DomainError } from './domain-error.type';

interface TemporaryCodeInvalidErrorMetadata {
  type: 'token' | 'pin';
}

export class TemporaryCodeInvalidError
  extends Error
  implements DomainError<TemporaryCodeInvalidErrorMetadata>
{
  readonly name = 'TemporaryCodeInvalidError';
  readonly code = 'temporary_code_invalid';

  constructor(readonly metadata: TemporaryCodeInvalidErrorMetadata) {
    super('The provided temporary code is invalid or already used.');
  }
}
