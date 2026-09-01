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
  Req,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { multerConfig } from './multer.config';
import { SupabaseService } from './supabase.service';
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService,
        private readonly supabaseService: SupabaseService,
  ) {}

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
  async create(@Body() createProdutoDto: CreateProdutoDto,@Req() req) {
    return this.produtoService.create(createProdutoDto,req.user);
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
  findAll(@Req() req) {
    return this.produtoService.findAll(req.user);
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
  findOne(@Param('id') id: string, @Req() req) {
    return this.produtoService.findOne(id, req.user);
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
  update(@Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
    @Req() req,) {
    return this.produtoService.update(id, updateProdutoDto, req.user);
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
  remove(@Param('id') id: string, @Req() req) {
    return this.produtoService.remove(id,req.user);
  }

@Post(':id/imagem')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(FileInterceptor('imagem', multerConfig))
async uploadImagem(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Req() req,
) {
  if (!file) throw new BadRequestException('Nenhum arquivo enviado');

  const ext = file.originalname.split('.').pop() ?? 'jpg';
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const path = `${file.fieldname}-${uniqueSuffix}.${ext}`;

  const bucket = process.env.SUPABASE_BUCKET_IMAGENS;
  if (!bucket) {
    throw new BadRequestException('Bucket de imagens n�o configurado');
  }

  const url = await this.supabaseService.uploadArquivo(
    bucket,
    path,
    file.buffer,
    file.mimetype,
  );

  return this.produtoService.salvarImagem(id, url, req.user);
}
}