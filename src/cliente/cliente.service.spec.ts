import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ClienteService } from './cliente.service';

import { Cliente } from './entities/cliente.entity';

describe('ClienteService', () => {
  let service: ClienteService;

  const mockRepository = {
    create: jest.fn(),

    save: jest.fn(),

    find: jest.fn(),

    findOne: jest.fn(),

    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,

        {
          provide: getRepositoryToken(Cliente),

          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um cliente', async () => {
    const dto = {
      nome: 'João',
      email: 'joao@gmail.com',
    };

    const clienteCriado = {
      id: '1',
      ...dto,
    };

    mockRepository.create.mockReturnValue(clienteCriado);

    mockRepository.save.mockResolvedValue(clienteCriado);

    const resultado = await service.create(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(dto);

    expect(mockRepository.save).toHaveBeenCalled();

    expect(resultado).toEqual(clienteCriado);
  });
});
