import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { CategoriaService } from './categoria.service';

import { Categoria } from './entities/categoria.entity';

import { CategoriaValidator } from './validators/categoria.validator';

describe('CategoriaService', () => {
  let service: CategoriaService;

  const mockRepository = {
    create: jest.fn(),

    save: jest.fn(),

    find: jest.fn(),

    findOne: jest.fn(),

    delete: jest.fn(),
  };

  const mockCategoriaValidator = {
    validateCategoria: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,

        {
          provide: getRepositoryToken(Categoria),

          useValue: mockRepository,
        },

        {
          provide: CategoriaValidator,

          useValue: mockCategoriaValidator,
        },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
