import { Test, TestingModule } from '@nestjs/testing';
import { StaticFilesControllerController } from './static-files-controller.controller';

describe('StaticFilesControllerController', () => {
  let controller: StaticFilesControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticFilesControllerController],
    }).compile();

    controller = module.get<StaticFilesControllerController>(
      StaticFilesControllerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
