import type { EntityManager, MikroORM } from '@mikro-orm/sqlite';

declare module 'h3' {
  interface H3EventContext {
    em: EntityManager;
    orm: MikroORM;
  }
}

declare module 'nitropack' {
  interface NitroApp {
    orm: MikroORM;
  }
}

export {};
