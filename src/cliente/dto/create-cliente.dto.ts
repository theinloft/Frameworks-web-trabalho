import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

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
}
