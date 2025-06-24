// base.subscriber.ts định nghĩa một lớp BaseSubscriber lắng nghe mọi sự kiện xảy ra trên các entity kế thừa từ BaseEntity

import { BaseEntity } from '@/common/entities/base.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class BaseSubscriber implements EntitySubscriberInterface<BaseEntity> {
  // lắng nghe mọi entity kế thừa từ BaseEntity
  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<BaseEntity>): void {
    console.log(`BEFORE ENTITY INSERTED: `, event.entity);
  }

  afterInsert(event: InsertEvent<BaseEntity>): void {
    console.log(`AFTER ENTITY INSERTED: `, event.entity);
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>): void {
    console.log(`BEFORE ENTITY UPDATED: `, event.entity);
  }

  afterUpdate(event: UpdateEvent<BaseEntity>): void {
    console.log(`AFTER ENTITY UPDATED: `, event.entity);
  }

  beforeRemove(event: RemoveEvent<BaseEntity>): void {
    console.log(`BEFORE ENTITY REMOVED: `, event.entity);
  }

  afterRemove(event: RemoveEvent<BaseEntity>): void {
    console.log(`AFTER ENTITY REMOVED: `, event.entity);
  }
}
