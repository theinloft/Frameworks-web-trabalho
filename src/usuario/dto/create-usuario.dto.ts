import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  nome!: string;

  @ApiProperty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  @IsEmail({},{message:'Email inválido.'})
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  senha!: string;
}
