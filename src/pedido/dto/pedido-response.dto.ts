import { PedidoItemResponseDto } from './pedido-item-response.dto';

export class PedidoResponseDto {
  id?: string;
  cliente?: any;
  valorTotal?: number;
  horarioPedido?: Date;
  agendado?: boolean;
  temFaixaHorario?: boolean;
  inicioAtendimento?: Date | null;
  fimAtendimento?: Date | null;
  itens?: PedidoItemResponseDto[];
}
