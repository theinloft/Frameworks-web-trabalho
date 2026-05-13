import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
