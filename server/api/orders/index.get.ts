import { useEntityManager } from '~~/server/utils/orm';
import { Order } from '~~/server/entities/Order';

export default defineEventHandler(async (event) => {
  const em = useEntityManager(event);
  const orders = await em.find(Order, {}, { populate: ['items'], orderBy: { createdAt: 'DESC' } });
  return orders;
});
