import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, ValidateIf } from 'class-validator';

export class AgendamentoDto {
  @ApiPropertyOptional({
    description: 'Indica se o pedido é um serviço agendado para o cliente',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  agendado?: boolean;

  @ApiPropertyOptional({
    description:
      'Indica se o atendimento tem faixa de horário (início e fim). Quando true, a faixa bloqueia outros pedidos do mesmo usuário',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  temFaixaHorario?: boolean;

  @ApiPropertyOptional({
    description: 'Data e hora do atendimento (ISO 8601). Obrigatório quando agendado = true',
    example: '2026-11-21T17:00:00.000Z',
  })
  @ValidateIf((o: AgendamentoDto) => o.agendado === true)
  @IsDateString()
  inicioAtendimento?: string;

  @ApiPropertyOptional({
    description: 'Fim da faixa de horário (ISO 8601). Obrigatório quando temFaixaHorario = true',
    example: '2026-11-21T18:30:00.000Z',
  })
  @ValidateIf((o: AgendamentoDto) => o.agendado === true && o.temFaixaHorario === true)
  @IsDateString()
  fimAtendimento?: string;
}
