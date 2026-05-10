import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column()
  nome?: string;
  @Column()
  email?: string;
}
