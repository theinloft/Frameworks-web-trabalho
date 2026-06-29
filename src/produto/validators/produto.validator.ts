import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProdutoValidator {
  constructor(
    @InjectRepository(Produto)
    private readonly repositoryProduto: Repository<Produto>,
  ) {}

  async validateProduto(dto: CreateProdutoDto, id?: string) {
    if (dto.nome) {
      const produtoExistente = await this.repositoryProduto.findOneBy({
        nome: dto.nome,
      });

      if (produtoExistente && produtoExistente.id !== id) {
        throw new BadRequestException('Já existe um produto com esse nome');
      }

      if (dto.nome.length < 3) {
        throw new BadRequestException('Nome inválido');
      }
    }

    if (dto.preco !== undefined && dto.preco <= 0) {
      throw new BadRequestException('Preço inválido');
    }

    if (dto.categoriaId !== undefined && dto.categoriaId <= 0) {
      throw new BadRequestException('Categoria inválida');
    }
  }
}
