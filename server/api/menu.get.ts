import { useEntityManager } from '~~/server/utils/orm';
import { MenuItem } from '~~/server/entities/MenuItem';
import { Category } from '~~/server/entities/Category';

export default defineEventHandler(async (event) => {
  const em = useEntityManager(event);
  const items = await em.find(MenuItem, {}, { populate: ['category'], orderBy: { sortOrder: 'ASC' } });
  return items;
});
