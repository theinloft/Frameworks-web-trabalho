import {
    IsDecimal,
    IsNotEmpty,
    IsNumber,
    IsUUID,
    Min,
    min,
} from 'class-validator';

export class CreateProdutoDto {
    @IsNotEmpty({ message: 'nome é obrigatório' })
    nome?: string;
    @IsNumber()
    @Min(0)
    preco?: number;

    @IsNumber()
    categoriaId?: number;
}
