import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { Categoria } from './entities/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaValidator } from './validators/categoria.validator';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaValidator],
  imports: [TypeOrmModule.forFeature([Categoria])],
})
export class CategoriaModule {}
