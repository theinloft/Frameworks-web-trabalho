import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column()
  nome?: string;
  @Column('decimal')
  preco?: number;
  @ManyToOne(() => Categoria)
  categoria?: Categoria;

  @Column({ nullable: true })
  imagem?: string;

   @ManyToOne(() => Usuario, { nullable: false, eager: false })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario;

  @Column()
  usuarioId!: number;
}
