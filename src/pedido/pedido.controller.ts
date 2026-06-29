import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { StatusPedido } from './entities/pedido.entity';

@ApiTags('Pedido')
@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar pedido',
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar pedidos',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos listados com sucesso',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter pedido',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido obtido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar pedido',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  // @ApiOperation({
  //   summary: 'Remover pedido',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Pedido removido com sucesso',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Pedido não encontrado',
  // })
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(id);
  }

  @Put('atualizar-status/:id')
  @ApiOperation({ summary: 'Atualizar status do pedido' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  atualizarStatus(
    @Param('id') id: string,
    @Body('status') status: StatusPedido,
  ) {
    if (!Object.values(StatusPedido).includes(status)) {
      throw new BadRequestException('Status inválido');
    }
    return this.pedidoService.atualizarStatus(id, status);
  }
}
