import { MikroORM } from '@mikro-orm/sqlite';
import config from '../../mikro-orm.config';

export default defineNitroPlugin(async (nitroApp) => {
  const orm = await MikroORM.init(config);

  nitroApp.orm = orm;

  nitroApp.hooks.hook('request', (event) => {
    event.context.em = orm.em.fork();
  });

  nitroApp.hooks.hook('afterResponse', async (event) => {
    if (event.context.em) {
      await event.context.em.flush();
      event.context.em = undefined;
    }
  });

  nitroApp.hooks.hook('close', async () => {
    await orm.close();
  });
});
