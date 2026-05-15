import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProdutoService } from './produto.service';

import { Produto } from './entities/produto.entity';

import { Categoria } from 'src/categoria/entities/categoria.entity';

import { ProdutoValidator } from './validators/produto.validator';

describe('ProdutoService', () => {
  let service: ProdutoService;

  let categoriaRepository: jest.Mocked<Repository<Categoria>>;

  const mockRepository = {
    create: jest.fn(),

    save: jest.fn(),

    find: jest.fn(),

    findOne: jest.fn(),

    delete: jest.fn(),
  };

  const mockCategoriaRepository = {
    findOne: jest.fn(),
  };

  const mockValidator = {
    validateProduto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,

        {
          provide: getRepositoryToken(Produto),

          useValue: mockRepository,
        },

        {
          provide: ProdutoValidator,

          useValue: mockValidator,
        },

        {
          provide: getRepositoryToken(Categoria),

          useValue: mockCategoriaRepository,
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);

    categoriaRepository = module.get(getRepositoryToken(Categoria));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um produto', async () => {
    const categoria = {
      id: '1',
      categoria: 'roupas',
    };

    const dto = {
      nome: 'Camiseta Nike',
      preco: 199.9,
      categoriaId: '1',
    };

    const produtoCriado = {
      id: '1',
      nome: dto.nome,
      preco: dto.preco,
      categoria,
    };

    categoriaRepository.findOne.mockResolvedValue(categoria as Categoria);

    mockRepository.create.mockReturnValue(produtoCriado);

    mockRepository.save.mockResolvedValue(produtoCriado);

    const resultado = await service.create(dto);

    expect(mockRepository.create).toHaveBeenCalled();

    expect(mockRepository.save).toHaveBeenCalled();

    expect(resultado).toEqual(produtoCriado);
  });
});
