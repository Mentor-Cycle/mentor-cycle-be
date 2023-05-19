import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
import { Stream } from 'stream';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@InputType()
export class UpdateUserPhotoInput {
  @Field()
  @IsString()
  @IsOptional()
  userId: string;

  @Field(() => GraphQLUpload)
  @IsOptional()
  file: FileUpload;
}
