import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('clientes')
@Unique(['email', 'usuarioId'])
@Unique(['documento', 'usuarioId'])
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  nome?: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column()
  email?: string;

  @ManyToOne(() => Usuario, { nullable: false, eager: false })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario;

  @Column()
  usuarioId!: number;

  @Column({ nullable: true })
  documento?: string;
}