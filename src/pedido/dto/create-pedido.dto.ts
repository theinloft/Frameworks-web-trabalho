import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { CreatePedidoItemDto } from './create-pedido-item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePedidoDto {
  @ApiProperty({
    description: 'ID do cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  clienteId!: string;

  @ApiProperty({
    description: 'Itens do pedido',

    type: [CreatePedidoItemDto],
  })
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreatePedidoItemDto)
  itens!: CreatePedidoItemDto[];
}
