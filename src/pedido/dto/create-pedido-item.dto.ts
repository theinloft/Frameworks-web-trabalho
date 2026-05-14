import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreatePedidoItemDto {
  @ApiProperty({
    description: 'ID do produto',

    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  produtoId!: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantidade!: number;
}
