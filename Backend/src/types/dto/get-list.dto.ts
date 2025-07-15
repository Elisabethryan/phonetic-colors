import { IsArray, IsString } from 'class-validator';

export class GetListDto {
    @IsArray()
    @IsString({each: true})
    list: string[];
  }