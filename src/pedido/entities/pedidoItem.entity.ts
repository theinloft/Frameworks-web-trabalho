import { Produto } from 'src/produto/entities/produto.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('pedido_itens')
export class PedidoItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens)
  pedido!: Pedido;

  @ManyToOne(() => Produto)
  produto!: Produto;

  @Column()
  quantidade!: number;

  @Column('decimal')
  precoUnitario!: number;
}
