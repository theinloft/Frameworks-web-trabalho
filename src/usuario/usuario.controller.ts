import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuariosService) {}

  @ApiOperation({ summary: 'cria um usuário' })
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.criar(createUsuarioDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: 'lista todos os usuários' })
  findAll() {
    return this.usuarioService.listar();
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiOperation({ summary: 'lista um usuário pelo ID' })
  findOne(@Param('id') id: string) {
    return this.usuarioService.buscarPorId(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'remove um usuário  pelo ID' })
  remove(@Param('id') id: string) {
    return this.usuarioService.remover(+id);
  }
}
