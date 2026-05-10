import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar categorias',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  findAll() {
    return this.categoriaService.findAll();
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
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id);
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
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(+id, updateCategoriaDto);
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
  remove(@Param('id') id: number) {
    return this.categoriaService.remove(+id);
  }
}
