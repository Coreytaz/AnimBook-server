import { Injectable } from '@nestjs/common';
import { slugify } from 'transliteration';

@Injectable()
export class GenerateSlugService {
  transliterateText(text: string): string {
    return slugify(text);
  }
}
