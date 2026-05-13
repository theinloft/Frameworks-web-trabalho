import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

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
}
