import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  nome!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  senha!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  perfil?: string;
}
