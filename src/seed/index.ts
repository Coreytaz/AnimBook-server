import 'reflect-metadata';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import pg from 'pg';

const { Client } = pg;

config({ quiet: true });

// Only fixed demo content is interpolated; escape identifiers and literals separately.
async function seed() {
  const settings = new ConfigService();
  const connectionOptions = {
    host: settings.get('DB_HOST'),
    port: Number(settings.get('DB_PORT')),
    user: settings.get('DB_USERNAME'),
    password: settings.get('DB_PASSWORD'),
    database: settings.get('DB_DATEBASE'),
    connectionTimeoutMillis: 15000,
    query_timeout: 15000,
    application_name: 'animbook-seed',
  };
  const quote = (value: string) => '"' + value.replace(/"/g, '""') + '"';
  const literal = (value: string) =>
    "U&'" +
    value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "''")
      .replace(
        /[^\x00-\x7F]/g,
        (character) =>
          '\\' + character.charCodeAt(0).toString(16).padStart(4, '0'),
      ) +
    "'";
  const schema = quote(
    new ConfigService().get<string>('DB_SCHEMA') || 'public',
  );
  const table = (name: string) => schema + '.' + quote(name);
  const statements: string[] = [];
  const groups = [
    {
      name: 'Манга',
      slug: 'demo-manga',
      series: ['Лунный экспресс', 'Город облаков', 'Хранители леса'],
      publisher: 'Лунные страницы',
    },
    {
      name: 'Комиксы',
      slug: 'demo-comics',
      series: ['Звёздный патруль', 'Тайны мегаполиса', 'Последний маяк'],
      publisher: 'Графический мир',
    },
    {
      name: 'Ранобэ',
      slug: 'demo-ranobe',
      series: [
        'Письма из другого мира',
        'Магия книжной лавки',
        'Дневник путешественника',
      ],
      publisher: 'Новая история',
    },
    {
      name: 'Артбуки',
      slug: 'demo-artbooks',
      series: ['Пейзажи воображения', 'Искусство персонажа', 'Мир анимации'],
      publisher: 'Палитра',
    },
  ];
  for (const [groupIndex, group] of groups.entries()) {
    const image = '/demo/' + group.slug + '.svg';
    const publisherSlug = group.slug + '-publisher';
    const categoryId =
      '(SELECT "_id" FROM ' +
      table('catergories') +
      ' WHERE slug = ' +
      literal(group.slug) +
      ')';
    const publisherId =
      '(SELECT id FROM ' +
      table('publisher') +
      ' WHERE slug = ' +
      literal(publisherSlug) +
      ')';
    statements.push(
      'INSERT INTO ' +
        table('catergories') +
        ' (name,slug,description,img) VALUES (' +
        [
          group.name,
          group.slug,
          'Демонстрационная коллекция: ' + group.name,
          image,
        ]
          .map(literal)
          .join(',') +
        ') ON CONFLICT (slug) DO NOTHING',
    );
    statements.push(
      'INSERT INTO ' +
        table('publisher') +
        ' (name,slug,city,category_id) VALUES (' +
        [group.publisher, publisherSlug, 'Екатеринбург']
          .map(literal)
          .join(',') +
        ',' +
        categoryId +
        ') ON CONFLICT (slug) DO NOTHING',
    );
    for (let index = 0; index < 9; index++) {
      const slug = group.slug + '-' + (index + 1);
      const name =
        group.series[index % 3] + '. Том ' + (Math.floor(index / 3) + 1);
      const description =
        'Демонстрационный товар. ' +
        name +
        ' — история о приключениях, дружбе и открытиях. Данные созданы для проверки каталога и оформления заказа.';
      statements.push(
        'INSERT INTO ' +
          table('product') +
          ' (name,slug,discription,price,img,category_id,"publisherId") VALUES (' +
          [name, slug, description].map(literal).join(',') +
          ',' +
          (490 + groupIndex * 250 + index * 130) +
          ',' +
          literal(JSON.stringify([{ src: image, alt: name }])) +
          '::json,' +
          categoryId +
          ',' +
          publisherId +
          ') ON CONFLICT (slug) DO NOTHING',
      );
      const attributes = [
        ['Издательство', group.publisher],
        ['Страниц', String(160 + index * 16)],
        ['Переплёт', index % 2 ? 'Твёрдый' : 'Мягкий'],
        ['Тип данных', 'Демонстрационные'],
      ];
      for (const [attribute, value] of attributes) {
        statements.push(
          'INSERT INTO ' +
            table('descriptions-product') +
            ' (name,description,product_id) SELECT ' +
            literal(attribute) +
            ',' +
            literal(value) +
            ',p."_id" FROM ' +
            table('product') +
            ' p WHERE p.slug = ' +
            literal(slug) +
            ' AND NOT EXISTS (SELECT 1 FROM ' +
            table('descriptions-product') +
            ' d WHERE d.product_id = p."_id" AND d.name = ' +
            literal(attribute) +
            ')',
        );
      }
    }
    const url = '/catalog/' + group.slug;
    statements.push(
      'INSERT INTO ' +
        table('banner') +
        ' (url,img,caption) SELECT ' +
        [url, image, group.name + ': откройте новую историю']
          .map(literal)
          .join(',') +
        ' WHERE NOT EXISTS (SELECT 1 FROM ' +
        table('banner') +
        ' WHERE url = ' +
        literal(url) +
        ')',
    );
  }
  const batches: string[] = [];
  let batch = '';
  for (const statement of statements) {
    if (Buffer.byteLength(batch + statement, 'utf8') > 10000 && batch) {
      batches.push(batch);
      batch = '';
    }
    batch += statement + ';\n';
  }
  if (batch) batches.push(batch);
  for (const [index, sql] of batches.entries()) {
    const client = new Client(connectionOptions);
    client.on('error', () => undefined);
    try {
      await client.connect();
      await client.query('BEGIN;\n' + sql + 'COMMIT;');
      console.log('Seed batch completed:', index + 1, '/', batches.length);
    } finally {
      await client.end();
    }
  }
  const verification = new Client(connectionOptions);
  verification.on('error', () => undefined);
  try {
    await verification.connect();
    const counts = await verification.query(
      'SELECT (SELECT count(*) FROM ' +
        table('catergories') +
        ') AS categories, (SELECT count(*) FROM ' +
        table('publisher') +
        ') AS publishers, (SELECT count(*) FROM ' +
        table('product') +
        ') AS products, (SELECT count(*) FROM ' +
        table('descriptions-product') +
        ') AS characteristics, (SELECT count(*) FROM ' +
        table('banner') +
        ') AS banners',
    );
    console.log('Demo seed complete. Database counts:', counts.rows[0]);
  } finally {
    await verification.end();
  }
}
seed().catch((error: unknown) => {
  console.error(
    'Demo seed failed:',
    error instanceof Error ? error.message : 'Unknown error',
  );
  process.exitCode = 1;
});
