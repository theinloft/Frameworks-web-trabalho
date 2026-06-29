import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { Categoria } from './entities/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaValidator } from './validators/categoria.validator';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaValidator],
  imports: [TypeOrmModule.forFeature([Categoria]), AuthModule],
})
export class CategoriaModule {}
