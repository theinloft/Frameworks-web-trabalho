import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCategoriaDto } from '../dto/create-categoria.dto';

@Injectable()
export class CategoriaValidator {
  validateCategoria(dto: CreateCategoriaDto) {
    if (dto.categoria.length < 3) {
      throw new BadRequestException('Nome inválido');
    }
  }
}
