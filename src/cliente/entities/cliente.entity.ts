import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column()
  nome?: string;

  @Column({
    unique: true,
  })
  email?: string;

       @ManyToOne(() => Usuario, { nullable: false, eager: false })
      @JoinColumn({ name: 'usuarioId' })
      usuario!: Usuario;
    
      @Column()
      usuarioId!: number;
}
