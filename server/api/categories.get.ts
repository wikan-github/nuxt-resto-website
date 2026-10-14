import { useEntityManager } from '~~/server/utils/orm';
import { Category } from '~~/server/entities/Category';

export default defineEventHandler(async (event) => {
  const em = useEntityManager(event);
  const categories = await em.find(Category, {}, { orderBy: { sortOrder: 'ASC' } });
  return categories;
});
