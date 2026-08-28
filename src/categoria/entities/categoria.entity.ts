import { Produto } from 'src/produto/entities/produto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

       @ManyToOne(() => Usuario, { nullable: false, eager: false })
      @JoinColumn({ name: 'usuarioId' })
      usuario!: Usuario;
    
      @Column()
      usuarioId!: number;
}
