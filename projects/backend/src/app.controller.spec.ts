import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Welcome To API Fenix-Ventures! -> Author: Jose Agraz - email: joseagraz29@gmail.com"', () => {
      expect(appController.getHome()).toBe('Welcome To API Fenix-Ventures! -> Author: Jose Agraz - email: joseagraz29@gmail.com');
    });
  });
});
