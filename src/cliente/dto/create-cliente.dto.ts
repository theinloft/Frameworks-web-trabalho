import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { cpfcnpjvalidator } from '../validators/cpf-cnpj.validator';

export class CreateClienteDto {
  @ApiProperty({
    example: 'João Silva',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim().replace(/\s+/g, ' '))
  nome!: string;

  @ApiProperty({
    example: 'joao@gmail.com',
  })
  @IsEmail()
  email?: string;

 @ValidateIf((o) => o.telefone !== '' && o.telefone !== undefined)
  @IsString()
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos (com DDD)',
  })
  telefone?: string;

  @IsOptional()
  @cpfcnpjvalidator()
  documento?: string;

}

