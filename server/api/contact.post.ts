import { readBody } from 'h3';
import { useEntityManager } from '~~/server/utils/orm';
import { ContactMessage } from '~~/server/entities/ContactMessage';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const em = useEntityManager(event);

  const message = em.create(ContactMessage, {
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
  });

  await em.persist(message).flush();
  return { success: true, id: message.id };
});
