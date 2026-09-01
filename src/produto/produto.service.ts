import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { ProdutoValidator } from './validators/produto.validator';
import { Perfil } from '../usuario/enums/perfil.enum';


@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,
    private readonly produtoValidator: ProdutoValidator,

    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) { }

  async create(dto: CreateProdutoDto,usuarioLogado: { id: number }) {
    await this.produtoValidator.validateProduto(dto);

    const produto = this.produtoRepo.create({
      nome: dto.nome,
      preco: dto.preco,
      categoria: {
        id: dto.categoriaId,
      },
      usuarioId: usuarioLogado.id,
    });

    const salvo = await this.produtoRepo.save(produto);

    return this.produtoRepo.findOneOrFail({
      where: { id: salvo.id },
      relations: ['categoria'],
    });
  }

  async findAll(usuarioLogado: { id: number; perfil: Perfil }) {
    if (usuarioLogado.perfil === Perfil.ADMIN_MASTER) {
      return this.produtoRepo.find({
        relations: ['categoria'],
      });
    }
    return this.produtoRepo.find({
      where: { usuarioId: usuarioLogado.id },
      relations: ['categoria'],
    });
  }

  async findOne(id: string,usuarioLogado: { id: number; perfil: Perfil }) {
    return this.produtoRepo.findOneOrFail({
      where: { id },
      relations: ['categoria'],
    });
    
    
  }

  async update(id: string, updateProdutoDto: UpdateProdutoDto, user: any) {
    await this.produtoValidator.validateProduto(updateProdutoDto, id);

    const produto = await this.produtoRepo.findOneBy({ id });
    if (!produto) throw new NotFoundException('Produto n√£o encontrado');

    if (updateProdutoDto.nome) produto.nome = updateProdutoDto.nome;
    if (updateProdutoDto.preco) produto.preco = updateProdutoDto.preco;
    if (updateProdutoDto.categoriaId) {
      produto.categoria = { id: updateProdutoDto.categoriaId } as Categoria;
    }

    return this.produtoRepo.save(produto);
  }

  async remove(id: string, usuarioLogado: { id: number; perfil: Perfil }) {
  const produto = await this.produtoRepo.findOneBy({ id });
  if (!produto) throw new NotFoundException('Produto n„o encontrado');

  if (usuarioLogado.perfil !== Perfil.ADMIN_MASTER && produto.usuarioId !== usuarioLogado.id) {
    throw new NotFoundException('Produto n„o encontrado');
  }

  return this.produtoRepo.remove(produto);
}

 async salvarImagem(id: string, imagemUrl: string, user) {
    const produto = await this.produtoRepo.findOneBy({ id });
    if (!produto) throw new NotFoundException('Produto n„o encontrado');

    produto.imagem = imagemUrl;
    return this.produtoRepo.save(produto);
  }
}
