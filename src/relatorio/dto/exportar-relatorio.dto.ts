import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { FiltroRelatorioDto } from './filtro-relatorio.dto';

export class ExportarRelatorioDto extends FiltroRelatorioDto {
  @ApiProperty({ enum: ['pdf', 'xlsx'], example: 'xlsx' })
  @IsIn(['pdf', 'xlsx'], { message: 'formato deve ser pdf ou xlsx' })
  formato!: 'pdf' | 'xlsx';
}