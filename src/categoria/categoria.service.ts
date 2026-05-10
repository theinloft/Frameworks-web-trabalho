import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaValidator } from './validators/categoria.validator';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repositoryCategoria: Repository<Categoria>,
    private readonly categoriaValidator: CategoriaValidator,
  ) {}
  async create(createCategoriaDto: CreateCategoriaDto) {
    this.categoriaValidator.validateCategoria(createCategoriaDto);
    const categoria = this.repositoryCategoria.create(createCategoriaDto);

    return await this.repositoryCategoria.save(categoria);
  }

  async findAll() {
    return this.repositoryCategoria.find();
  }

  async findOne(id: number) {
    return this.repositoryCategoria.findOne({ where: { id } });
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    this.categoriaValidator.validateCategoria(updateCategoriaDto);
    const categoria = await this.repositoryCategoria.findOne({ where: { id } });
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }
    Object.assign(categoria, updateCategoriaDto);
    return this.repositoryCategoria.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.repositoryCategoria.findOne({ where: { id } });
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }
    return this.repositoryCategoria.remove(categoria);
  }
}
