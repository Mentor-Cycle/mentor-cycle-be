import { InputType, PartialType } from '@nestjs/graphql';
import { CreateLanguageInput } from './create-language.input';

@InputType()
export class UpdateLanguageInput extends PartialType(CreateLanguageInput) {}
