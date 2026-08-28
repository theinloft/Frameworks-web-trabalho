import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaValidator } from './validators/categoria.validator';
import { Perfil } from 'src/usuario/enums/perfil.enum';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repositoryCategoria: Repository<Categoria>,
    private readonly categoriaValidator: CategoriaValidator,
  ) {}

  async create(dto: CreateCategoriaDto, usuarioLogado: { id: number }) {
    await this.categoriaValidator.validateCategoria(dto);

    const categoria = this.repositoryCategoria.create({
      ...dto,
      usuarioId: usuarioLogado.id,
    });

    return this.repositoryCategoria.save(categoria);
  }

  async findAll(usuarioLogado: { id: number; perfil: Perfil }) {
    if (usuarioLogado.perfil === Perfil.ADMIN_MASTER) {
      return this.repositoryCategoria.find();
    }
    return this.repositoryCategoria.find({
      where: { usuarioId: usuarioLogado.id },
    });
  }

  async findOne(id: number, usuarioLogado: { id: number; perfil: Perfil }) {
    const categoria = await this.repositoryCategoria.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      categoria.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return categoria;
  }

  async update(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
    usuarioLogado: { id: number; perfil: Perfil },
  ) {
    await this.categoriaValidator.validateCategoria(updateCategoriaDto);

    const categoria = await this.repositoryCategoria.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      categoria.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Categoria não encontrada');
    }

    Object.assign(categoria, updateCategoriaDto);
    return this.repositoryCategoria.save(categoria);
  }

  async remove(id: number, usuarioLogado: { id: number; perfil: Perfil }) {
    const categoria = await this.repositoryCategoria.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      categoria.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return this.repositoryCategoria.remove(categoria);
  }
}