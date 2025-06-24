import { DataSource } from 'typeorm';
import { databaseConfig } from '@/config/database.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (): Promise<DataSource> => {
      const dataSource = new DataSource(databaseConfig);

      try {
        await dataSource.initialize();
        console.log('🔗 Database connected successfully');
        return dataSource;
      } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
      }
    },
  },
];
