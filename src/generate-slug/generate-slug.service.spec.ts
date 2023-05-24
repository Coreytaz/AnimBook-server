import { Test, TestingModule } from '@nestjs/testing';
import { GenerateSlugService } from './generate-slug.service';

describe('GenerateSlugService', () => {
  let service: GenerateSlugService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateSlugService],
    }).compile();

    service = module.get<GenerateSlugService>(GenerateSlugService);
  });

  describe('GenerateSlugText', () => {
    it('should transliterate the text and convert to slug', () => {
      const text = 'Привет мир';
      const transliteratedText = service.transliterateText(text);

      expect(transliteratedText).toBe('privet-mir');
    });
  });
});
