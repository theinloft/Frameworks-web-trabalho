import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({
    example: 'João Silva',
  })
  @IsString()
  @MinLength(3)
  nome?: string;

  @ApiProperty({
    example: 'joao@gmail.com',
  })
  @IsEmail()
  email?: string;
}
