import 'reflect-metadata';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions, Table } from 'typeorm';
import { getTypeormConfig } from '../config/typeorm.config';

config({ quiet: true });
async function createSchema() {
  const options = await getTypeormConfig(new ConfigService());
  const source = new DataSource({
    ...options,
    synchronize: false,
    extra: { max: 2, connectionTimeoutMillis: 15000 },
  } as DataSourceOptions);
  try {
    await source.initialize();
    const schema = new ConfigService().get<string>('DB_SCHEMA') || 'public';
    await source.query(
      'CREATE SCHEMA IF NOT EXISTS "' + schema.replace(/"/g, '""') + '"',
    );
    console.log('Connected. Creating schema from entity models...');
    const existingTables: { table_name: string }[] = await source.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = $1',
      [schema],
    );
    const existingConstraints: { conname: string }[] = await source.query(
      'SELECT c.conname FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace WHERE n.nspname = $1',
      [schema],
    );
    const tableNames = new Set(existingTables.map((table) => table.table_name));
    const constraintNames = new Set(
      existingConstraints.map((constraint) => constraint.conname),
    );
    const runner = source.createQueryRunner();
    runner.enableSqlMemory();
    try {
      for (const metadata of source.entityMetadatas) {
        if (tableNames.has(metadata.tableName)) continue;
        await runner.createTable(
          Table.create(metadata, source.driver),
          false,
          false,
          true,
        );
      }
      const quote = (value: string) => '"' + value.replace(/"/g, '""') + '"';
      const literal = (value: string) => "'" + value.replace(/'/g, "''") + "'";
      const statements = runner
        .getMemorySql()
        .upQueries.map((query) =>
          query.query.replace('CREATE TABLE ', 'CREATE TABLE IF NOT EXISTS '),
        );
      for (const metadata of source.entityMetadatas) {
        for (const key of metadata.foreignKeys) {
          if (constraintNames.has(key.name)) continue;
          const table = quote(schema) + '.' + quote(metadata.tableName);
          const target =
            quote(schema) + '.' + quote(key.referencedEntityMetadata.tableName);
          statements.push(
            'DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = ' +
              literal(key.name) +
              ' AND conrelid = ' +
              literal(table) +
              '::regclass) THEN ALTER TABLE ' +
              table +
              ' ADD CONSTRAINT ' +
              quote(key.name) +
              ' FOREIGN KEY (' +
              key.columnNames.map(quote).join(', ') +
              ') REFERENCES ' +
              target +
              ' (' +
              key.referencedColumnNames.map(quote).join(', ') +
              ') ON DELETE ' +
              (key.onDelete || 'NO ACTION') +
              ' ON UPDATE ' +
              (key.onUpdate || 'NO ACTION') +
              '; END IF; END $$',
          );
        }
      }
      if (statements.length)
        await source.query('BEGIN;\n' + statements.join(';\n') + ';\nCOMMIT;');
    } finally {
      runner.disableSqlMemory();
      await runner.release();
    }
    const tables: { table_name: string }[] = await source.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name',
      [schema],
    );
    console.log(
      'Schema ready:',
      tables.map((table) => table.table_name).join(', '),
    );
  } finally {
    if (source.isInitialized) await source.destroy();
  }
}
createSchema().catch((error: unknown) => {
  console.error(
    'Schema creation failed:',
    error instanceof Error ? error.message : 'Unknown error',
  );
  process.exitCode = 1;
});
