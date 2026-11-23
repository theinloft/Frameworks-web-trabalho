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

  async validateCategoria(
    dto: Partial<CreateCategoriaDto>,
    id?: number,
    usuarioId?: number,
  ) {
    if (dto.categoria === undefined) return;

    if (dto.categoria.trim().length < 3) {
      throw new BadRequestException('Categoria inválida');
    }

    if (usuarioId === undefined) {
      throw new BadRequestException('Usuário não informado');
    }

    const categoriaExiste = await this.repositoryCategoria
      .createQueryBuilder('categoria')
      .where('LOWER(TRIM(categoria.categoria)) = LOWER(TRIM(:categoria))', {
        categoria: dto.categoria,
      })
      .andWhere('categoria.usuarioId = :usuarioId', { usuarioId })
      .getOne();

    if (categoriaExiste && categoriaExiste.id !== id) {
      throw new BadRequestException('Já existe uma categoria com esse nome');
    }
  }
}