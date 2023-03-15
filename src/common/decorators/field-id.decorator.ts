import { Field, FieldOptions, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

export function FieldId(options?: FieldOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, key: string) => {
    Field(() => ID, options)(target, key);
    IsUUID()(target, key);
  };
}
