import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Perfil } from '../enums/perfil.enum';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nome?: string;

  @Column({ unique: true })
  email?: string;

@Column({ type: 'varchar', nullable: true })
senha?: string | null;

   @Column({ default: false })
  emailVerificado?: boolean;

  @Column({
    type: 'enum',
    enum: Perfil,
    default: Perfil.USUARIO,
  })
  perfil?: Perfil;
}
