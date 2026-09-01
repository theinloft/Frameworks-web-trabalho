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
  Req,
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
  create(@Body() createPedidoDto: CreatePedidoDto,@Req() req) {
    return this.pedidoService.create(createPedidoDto, req.user);
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
  findAll(@Req() req) {
    return this.pedidoService.findAll(req.user);
  }

 @Get(':id')
@ApiOperation({ summary: 'Obter pedido' })
@ApiResponse({ status: 200, description: 'Pedido obtido com sucesso' })
@ApiResponse({ status: 404, description: 'Pedido n�o encontrado' })
@ApiBearerAuth()
@UseGuards(JwtGuard)
findOne(@Param('id') id: string, @Req() req) {
  return this.pedidoService.findOne(id, req.user);
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
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto,@Req() req) {
    return this.pedidoService.update(id, updatePedidoDto,req.user);
  }


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
  @Delete(':id')
@ApiExcludeEndpoint()
remove(@Param('id') id: string, @Req() req) {
  return this.pedidoService.remove(id, req.user);
}

@Put('atualizar-status/:id')
@ApiOperation({ summary: 'Atualizar status do pedido' })
@ApiBearerAuth()
@UseGuards(JwtGuard)
atualizarStatus(
  @Param('id') id: string,
  @Body('status') status: StatusPedido,
  @Req() req,
) {
  if (!Object.values(StatusPedido).includes(status)) {
    throw new BadRequestException('Status inv�lido');
  }
  return this.pedidoService.atualizarStatus(id, status, req.user);
}
}