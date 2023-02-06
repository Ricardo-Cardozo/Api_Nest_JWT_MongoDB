import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  readonly password: string;
}
