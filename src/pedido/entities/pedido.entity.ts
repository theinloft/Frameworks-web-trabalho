import { Cliente } from 'src/cliente/entities/cliente.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PedidoItem } from './pedidoItem.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  horarioPedido!: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  valorTotal!: number;

  @ManyToOne(() => Cliente)
  cliente!: Cliente;

  @OneToMany(() => PedidoItem, (item) => item.pedido, {
    cascade: true,
    eager: true,
  })
  itens!: PedidoItem[];
}
