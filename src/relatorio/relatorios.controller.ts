import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ExportarRelatorioDto } from './dto/exportar-relatorio.dto';
import { FiltroRelatorioDto } from './dto/filtro-relatorio.dto';
import { RelatoriosService } from './relatorios.service';

@ApiTags('Relatórios')
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('pedidos/resumo')
  @ApiOperation({
    summary: 'Resumo de pedidos concluídos por forma de pagamento',
  })
  @ApiResponse({ status: 200, description: 'Resumo gerado com sucesso' })
  @ApiResponse({ status: 400, description: 'Filtros inválidos' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  resumo(@Query() filtro: FiltroRelatorioDto, @Req() req) {
    return this.relatoriosService.resumo(filtro, req.user);
  }

  @Get('pedidos/exportar')
  @ApiOperation({ summary: 'Exporta o relatório de pedidos em PDF ou Excel' })
  @ApiResponse({ status: 200, description: 'Arquivo gerado com sucesso' })
  @ApiResponse({ status: 400, description: 'Filtros ou formato inválidos' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async exportar(
    @Query() query: ExportarRelatorioDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { formato, ...filtro } = query;
    const arquivo = await this.relatoriosService.exportar(
      filtro,
      formato,
      req.user,
    );
    res.set({
      'Content-Type': arquivo.contentType,
      'Content-Disposition': `attachment; filename="${arquivo.nomeArquivo}"`,
    });
    return new StreamableFile(arquivo.buffer);
  }
}