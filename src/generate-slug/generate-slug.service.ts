import { Injectable } from '@nestjs/common';
import { transliterate as tr, slugify } from 'transliteration';

@Injectable()
export class GenerateSlugService {
  transliterateText(text: string): string {
    return slugify(text);
  }
}
