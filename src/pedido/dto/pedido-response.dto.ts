import { PedidoItemResponseDto } from './pedido-item-response.dto';

export class PedidoResponseDto {
  id?: string;
  cliente?: any;
  valorTotal?: number;
  horarioPedido?: Date;
  itens?: PedidoItemResponseDto[];
}
