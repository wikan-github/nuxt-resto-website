import { useEntityManager } from '~~/server/utils/orm';
import { Promotion } from '~~/server/entities/Promotion';

export default defineEventHandler(async (event) => {
  const em = useEntityManager(event);
  const promotions = await em.find(Promotion, {}, { orderBy: { id: 'ASC' } });
  return promotions;
});
