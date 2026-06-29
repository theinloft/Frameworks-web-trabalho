import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nome?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ nullable: false })
  senha?: string;

  @Column({ default: 'admin' })
  perfil?: string;
}
