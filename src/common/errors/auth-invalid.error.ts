import { DomainError } from '../types';

interface AuthInvalidErrorMetadata {
  field: 'email' | 'password';
}

export class AuthInvalidError
  extends Error
  implements DomainError<AuthInvalidErrorMetadata>
{
  readonly name = 'AuthInvalidError';
  readonly code = 'auth_invalid';

  constructor(readonly metadata: AuthInvalidErrorMetadata) {
    super('The email and/or password used for authentication are invalid.');
  }
}
