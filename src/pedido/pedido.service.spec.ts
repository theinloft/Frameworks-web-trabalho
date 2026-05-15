import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PedidoService } from './pedido.service';

import { Pedido } from './entities/pedido.entity';

import { Produto } from 'src/produto/entities/produto.entity';

import { Cliente } from 'src/cliente/entities/cliente.entity';

import { PedidoValidator } from './validators/pedido.validator';

describe('PedidoService', () => {
  let service: PedidoService;

  let pedidoRepo: jest.Mocked<Repository<Pedido>>;

  let produtoRepo: jest.Mocked<Repository<Produto>>;

  let clienteRepo: jest.Mocked<Repository<Cliente>>;

  beforeEach(async () => {
    pedidoRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Pedido>>;

    produtoRepo = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Produto>>;

    clienteRepo = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Cliente>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,

        {
          provide: getRepositoryToken(Pedido),
          useValue: pedidoRepo,
        },

        {
          provide: getRepositoryToken(Produto),
          useValue: produtoRepo,
        },

        {
          provide: getRepositoryToken(Cliente),
          useValue: clienteRepo,
        },

        {
          provide: PedidoValidator,
          useValue: {
            validatePedido: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve calcular valor total do pedido', async () => {
    const dto = {
      clienteId: '1',
      itens: [
        {
          produtoId: '10',
          quantidade: 2,
        },
      ],
    };

    const cliente = {
      id: '1',
      nome: 'João',
    };

    const produto = {
      id: '10',
      nome: 'Camiseta',
      preco: 100,
    };

    const pedidoSalvo = {
      id: '999',
      valorTotal: 200,
      cliente,
      itens: [
        {
          produto,
          quantidade: 2,
          precoUnitario: 100,
        },
      ],
    };

    clienteRepo.findOne.mockResolvedValue(cliente as never);

    produtoRepo.findOne.mockResolvedValue(produto as never);

    pedidoRepo.create.mockReturnValue(pedidoSalvo as never);

    pedidoRepo.save.mockResolvedValue(pedidoSalvo as never);

    const resultado = await service.create(dto);

    expect(resultado.valorTotal).toBe(200);
  });
});
