import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Camisas e Camisetas',
  })
  @IsString()
  @MinLength(3)
  categoria: string;
}
