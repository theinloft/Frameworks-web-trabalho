import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { PedidoItem } from './entities/pedidoItem.entity';
import { Pedido } from './entities/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoValidator } from './validators/pedido.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoItem, Produto, Cliente])],
  controllers: [PedidoController],
  providers: [PedidoService, PedidoValidator],
})
export class PedidoModule {}
