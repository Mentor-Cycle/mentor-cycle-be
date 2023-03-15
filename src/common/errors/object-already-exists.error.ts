import { ObjectType } from '@common/types';
import { DomainError } from '@common/errors';

interface ObjectAlreadyExistsErrorMetadata {
  objectType: ObjectType;
  field: string;
}

export class ObjectAlreadyExistsError
  extends Error
  implements DomainError<ObjectAlreadyExistsErrorMetadata>
{
  readonly name = 'ObjectAlreadyExistsError';
  readonly code = 'object_already_exists';

  constructor(readonly metadata: ObjectAlreadyExistsErrorMetadata) {
    super(
      `The ${metadata.objectType} with its specified ${metadata.field} already exists.`,
    );
  }
}
