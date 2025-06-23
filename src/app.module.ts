import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './modules/redis/redis.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [RedisModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
