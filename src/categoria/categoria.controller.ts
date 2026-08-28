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
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar categoria',
  })
  @ApiResponse({
    status: 201,
    description: 'Criado',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async create(@Body() createCategoriaDto: CreateCategoriaDto, @Req() req) {
    return this.categoriaService.create(createCategoriaDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar categorias',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findAll(@Req() req) {
    return this.categoriaService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter categoria pelo ID',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 404,
    description: 'Não encontrado',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.categoriaService.findOne(+id, req.user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 404,
    description: 'Não encontrado',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
    @Req() req,
  ) {
    return this.categoriaService.update(+id, updateCategoriaDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 404,
    description: 'Não encontrado',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.categoriaService.remove(+id, req.user);
  }
}