import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from './text.controller';
import { TextService } from './text.service';
import { DbTestService } from '../db/db-test-service';

describe('TextController', () => {
  let textController: TextController;
  const textService = { getText: jest.fn() };
  const dbTestService = { checkConnection: jest.fn() };

  beforeEach(async () => {
    const text: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
      providers: [
        { provide: TextService, useValue: textService },
        { provide: DbTestService, useValue: dbTestService },
      ],
    }).compile();

    textController = text.get<TextController>(TextController);
  });

  describe('getListItem', () => {
    it('delegates text lookup to TextService', async () => {
      const expectedText = { id: '12345', text: [] };
      textService.getText.mockResolvedValue(expectedText);

      await expect(textController.getListItem('12345')).resolves.toEqual(
        expectedText,
      );
      expect(textService.getText).toHaveBeenCalledWith('12345');
    });
  });
});
