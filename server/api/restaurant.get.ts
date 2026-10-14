import { useEntityManager } from '~~/server/utils/orm';
import { Restaurant } from '~~/server/entities/Restaurant';

export default defineEventHandler(async (event) => {
  const em = useEntityManager(event);
  const restaurant = await em.findOne(Restaurant, { id: 1 });
  if (!restaurant) {
    throw createError({ statusCode: 404, message: 'Restaurant config not found' });
  }
  return restaurant;
});
