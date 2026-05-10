import { Produto } from 'src/produto/entities/produto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  categoria: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos: Produto[];
}
