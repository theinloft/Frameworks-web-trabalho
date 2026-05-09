import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateProdutoDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Casaco Volcom Stone',
  })
  @IsNotEmpty({ message: 'nome é obrigatório' })
  nome?: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 4999.9,
  })
  @IsNumber()
  @Min(0)
  preco?: number;

  @ApiProperty({
    description: 'ID da categoria do produto',
    example: 1,
  })
  @IsNumber()
  categoriaId?: number;
}
