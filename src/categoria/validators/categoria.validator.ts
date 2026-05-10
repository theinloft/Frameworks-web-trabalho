import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { Categoria } from '../entities/categoria.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriaValidator {
  constructor(
    @InjectRepository(Categoria)
    private readonly repositoryCategoria: Repository<Categoria>,
  ) {}
  async validateCategoria(dto: Partial<CreateCategoriaDto>) {
    const categoriaExiste = await this.repositoryCategoria
      .createQueryBuilder('categoria')
      .where('LOWER(TRIM(categoria.categoria)) = LOWER(TRIM(:categoria))', {
        categoria: dto.categoria,
      })
      .getOne();

    if (categoriaExiste) {
      throw new BadRequestException('Já existe uma categoria com esse nome');
    }

    if (dto.categoria && dto.categoria.length < 3) {
      throw new BadRequestException('Categoria inválida');
    }
  }
}
