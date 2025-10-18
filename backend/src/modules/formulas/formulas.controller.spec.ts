import { Test, TestingModule } from '@nestjs/testing';
import { FormulasController } from './formulas.controller';
import { FormulasService } from './formulas.service';

describe('FormulasController', () => {
  let controller: FormulasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormulasController],
      providers: [FormulasService],
    }).compile();

    controller = module.get<FormulasController>(FormulasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
