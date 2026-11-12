import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { FormaPagamento } from 'src/pedido/entities/pedido.entity';
 
export class FiltroRelatorioDto {
  @ApiPropertyOptional({ example: '2026-11-01' })
  @IsOptional()
  @IsDateString({}, { message: 'dataInicio inválida (use AAAA-MM-DD)' })
  dataInicio?: string;
 
  @ApiPropertyOptional({ example: '2026-11-30' })
  @IsOptional()
  @IsDateString({}, { message: 'dataFim inválida (use AAAA-MM-DD)' })
  dataFim?: string;
 
  @ApiPropertyOptional({ enum: FormaPagamento })
  @IsOptional()
  @IsEnum(FormaPagamento, { message: 'Forma de pagamento inválida' })
  formaPagamento?: FormaPagamento;
}