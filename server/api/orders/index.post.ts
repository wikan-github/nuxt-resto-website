import { readBody } from 'h3';
import { useEntityManager } from '~~/server/utils/orm';
import { Order } from '~~/server/entities/Order';
import { OrderItem } from '~~/server/entities/OrderItem';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const em = useEntityManager(event);

  const order = em.create(Order, {
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    orderType: body.orderType,
    tableNumber: body.tableNumber,
    deliveryAddress: body.deliveryAddress,
    totalAmount: body.totalAmount,
    status: 'pending',
  });

  for (const item of body.items) {
    const orderItem = em.create(OrderItem, {
      itemId: item.itemId,
      itemName: item.itemName,
      quantity: item.quantity,
      price: item.price,
      orderType: item.orderType,
      order,
    });
    order.items.add(orderItem);
  }

  await em.persist(order).flush();
  return { success: true, id: order.id };
});
