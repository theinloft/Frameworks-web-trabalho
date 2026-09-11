import { IsEnum } from 'class-validator';
import { FormaPagamento } from '../entities/pedido.entity';

export class ConcluirPedidoDto {
  @IsEnum(FormaPagamento, { message: 'Forma de pagamento inválida' })
  formaPagamento!: FormaPagamento;
}