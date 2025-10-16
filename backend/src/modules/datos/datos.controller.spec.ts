import { Test, TestingModule } from '@nestjs/testing';
import { DatosController } from './datos.controller';
import { DatosService } from './datos.service';

describe('DatosController', () => {
  let controller: DatosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatosController],
      providers: [DatosService],
    }).compile();

    controller = module.get<DatosController>(DatosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
