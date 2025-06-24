import { DataSource } from 'typeorm';
import { databaseConfig } from '@/config/database.config';
import { CreateDefaultRoles1700000000001 } from './1700000000001-CreateDefaultRoles';
import { CreateDefaultCategories1700000000002 } from './1700000000002-CreateDefaultCategories';

async function runSeeds() {
  const dataSource = new DataSource(databaseConfig);

  try {
    await dataSource.initialize();
    console.log('🔗 Database connected for seeding');

    // Run seeds in order
    const seeds = [
      new CreateDefaultRoles1700000000001(),
      new CreateDefaultCategories1700000000002(),
    ];

    for (const seed of seeds) {
      console.log(`Running seed: ${seed.constructor.name}`);
      await seed.run(dataSource);
    }

    console.log('🌱 All seeds completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();
