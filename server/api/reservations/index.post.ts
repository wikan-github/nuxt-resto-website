import { readBody } from 'h3';
import { useEntityManager } from '~~/server/utils/orm';
import { Reservation } from '~~/server/entities/Reservation';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const em = useEntityManager(event);

  const reservation = em.create(Reservation, {
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    customerEmail: body.customerEmail,
    date: body.date,
    time: body.time,
    partySize: body.partySize,
    specialRequests: body.specialRequests,
    status: 'pending',
  });

  await em.persist(reservation).flush();
  return { success: true, id: reservation.id };
});
