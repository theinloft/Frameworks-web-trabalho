import { Inject, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { ProdutoValidator } from './validators/produto.validator';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,
    private readonly produtoValidator: ProdutoValidator,

    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  async create(dto: CreateProdutoDto) {
    await this.produtoValidator.validateProduto(dto);

    const produto = this.produtoRepo.create({
      nome: dto.nome,
      preco: dto.preco,
      categoria: {
        id: dto.categoriaId,
      },
    });

    return this.produtoRepo.save(produto);
  }

  async findAll() {
    return this.produtoRepo.find();
  }

  async findOne(id: string) {
    return this.produtoRepo.findOneByOrFail({ id });
  }

  async update(id: string, updateProdutoDto: UpdateProdutoDto) {
    await this.produtoValidator.validateProduto(updateProdutoDto);
    return this.produtoRepo.update(id, updateProdutoDto);
  }

  async remove(id: string) {
    return this.produtoRepo.remove({ id });
  }
}
