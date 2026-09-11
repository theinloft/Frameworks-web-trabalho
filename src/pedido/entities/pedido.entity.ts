import { Cliente } from 'src/cliente/entities/cliente.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PedidoItem } from './pedidoItem.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export enum StatusPedido {
  ANDAMENTO = 'andamento',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado',
}
export enum FormaPagamento {
  DINHEIRO = 'dinheiro',
  CARTAO = 'cartao',
  PIX = 'pix',
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

  @Column({ type: 'enum', enum: FormaPagamento, nullable: true })
  formaPagamento?: FormaPagamento;

  @ManyToOne(() => Cliente)
  cliente!: Cliente;

  @OneToMany(() => PedidoItem, (item) => item.pedido, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  itens!: PedidoItem[];

     @ManyToOne(() => Usuario, { nullable: false, eager: false })
    @JoinColumn({ name: 'usuarioId' })
    usuario!: Usuario;
  
    @Column()
    usuarioId!: number;
  
}
