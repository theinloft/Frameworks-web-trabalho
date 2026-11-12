import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';
 
@Module({
  imports: [TypeOrmModule.forFeature([Pedido]), AuthModule],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
 