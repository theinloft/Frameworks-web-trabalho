import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @ApiOperation({ summary: 'Criar cliente' })
  @ApiResponse({ status: 201, description: 'Criado' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  create(@Body() createClienteDto: CreateClienteDto, @Req() req) {
    return this.clienteService.create(createClienteDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findAll(@Req() req) {
    return this.clienteService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter cliente' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.clienteService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
    @Req() req,
  ) {
    return this.clienteService.update(id, updateClienteDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cliente' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.clienteService.remove(id, req.user);
  }
}