import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { ProductEntity } from './entities/product.entity';
import { QueryProduct, SortEnum } from './types';

describe('ProductService pagination after TypeORM migration', () => {
  const query = {
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };
  const service = new ProductService(
    { createQueryBuilder: () => query } as unknown as Repository<ProductEntity>,
    null,
    null,
    null,
    new ConfigService({ API_FRONT: 'https://example.test/catalog/' }),
  );

  beforeEach(() => jest.clearAllMocks());

  it('retains the frontend response shape, filters, and page links', async () => {
    const items = [{ _id: 'product' }];
    query.getManyAndCount.mockResolvedValue([items, 13]);
    const result = await service.getProducts('books', {
      limit: '6',
      page: '2',
      minPrice: '100',
      maxPrice: '1000',
      sort: SortEnum.LowerPrice,
    });
    expect(query.skip).toHaveBeenCalledWith(6);
    expect(query.take).toHaveBeenCalledWith(6);
    expect(query.andWhere).toHaveBeenCalledWith('product.price >= :minPrice', {
      minPrice: '100',
    });
    expect(query.andWhere).toHaveBeenCalledWith('product.price <= :maxPrice', {
      maxPrice: '1000',
    });
    expect(result).toEqual({
      items,
      meta: {
        itemCount: 1,
        totalItems: 13,
        itemsPerPage: 6,
        totalPages: 3,
        currentPage: 2,
      },
      links: {
        first: 'https://example.test/catalog/books?limit=6&page=1',
        previous: 'https://example.test/catalog/books?limit=6&page=1',
        next: 'https://example.test/catalog/books?limit=6&page=3',
        last: 'https://example.test/catalog/books?limit=6&page=3',
      },
    });
  });

  it('returns empty items and no adjacent pages for an empty catalog', async () => {
    query.getManyAndCount.mockResolvedValue([[], 0]);
    const result = await service.getProducts('books', {} as QueryProduct);
    expect(result.items).toEqual([]);
    expect(result.meta).toMatchObject({
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 6,
    });
    expect(result.links.previous).toBe('');
    expect(result.links.next).toBe('');
  });
});
