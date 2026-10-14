import { useEntityManager } from '~~/server/utils/orm';
import { Reservation } from '~~/server/entities/Reservation';

export default defineEventHandler(async (event) => {
  const em = useEntityManager(event);
  const reservations = await em.find(Reservation, {}, { orderBy: { createdAt: 'DESC' } });
  return reservations;
});
