import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { multerConfig } from './multer.config';
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar produto',
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
  async create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.create(createProdutoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar produtos',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  findAll() {
    return this.produtoService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter produto pelo ID',
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
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar produto',
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
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(id, updateProdutoDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover produto',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 404,
    description: 'Não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.produtoService.remove(id);
  }

  @Post(':id/imagem')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('imagem', multerConfig))
  async uploadImagem(
    @Param('id') id: string,
    @UploadedFile()
    file: { filename: string; fieldname: string; originalname: string },
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    return this.produtoService.salvarImagem(id, file.filename);
  }
}
