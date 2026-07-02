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

export enum StatusPedido {
  ANDAMENTO = 'andamento',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado',
}
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

  @Column({ type: 'enum', enum: StatusPedido, default: StatusPedido.ANDAMENTO })
  status!: StatusPedido;

  @ManyToOne(() => Cliente)
  cliente!: Cliente;

  @OneToMany(() => PedidoItem, (item) => item.pedido, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  itens!: PedidoItem[];
}
