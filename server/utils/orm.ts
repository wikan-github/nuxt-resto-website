import type { MikroORM, EntityManager } from '@mikro-orm/sqlite';
import type { H3Event } from 'h3';

export function useOrm(): MikroORM {
  return useNitroApp().orm as MikroORM;
}

export function useEntityManager(event: H3Event): EntityManager {
  return event.context.em as EntityManager;
}
