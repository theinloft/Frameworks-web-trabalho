import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Camisas e Camisetas',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @Transform(({ value }) =>
    String(value).trim().replace(/\s+/g, ' ').toLowerCase(),
  )
  categoria?: string;
}
