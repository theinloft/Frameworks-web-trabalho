import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { ProdutoValidator } from './validators/produto.validator';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Categoria]), AuthModule],
  providers: [ProdutoService, ProdutoValidator],
  controllers: [ProdutoController],
})
export class ProdutoModule {}
