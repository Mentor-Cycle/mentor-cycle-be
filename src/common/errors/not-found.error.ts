import { DomainError } from '@common/errors';

interface NotFoundErrorMetadata {
  field: 'user';
}

export class NotFoundError
  extends Error
  implements DomainError<NotFoundErrorMetadata>
{
  readonly name = 'NotFoundError';
  readonly code = 'object_not_found';

  constructor(readonly metadata: NotFoundErrorMetadata) {
    super(`${metadata.field} not found`);
  }
}
