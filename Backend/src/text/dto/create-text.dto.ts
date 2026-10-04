import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTextDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  transcription: string;
}
