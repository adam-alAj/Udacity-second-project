import Client from '../db';

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get orders: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find order ${id}: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *';
      const result = await conn.query(sql, [o.status, o.user_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot add new order: ${err}`);
    }
  }

  async addProduct(quantity: number, orderId: number, productId: number) {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [quantity, orderId, productId]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot add product ${productId} to order ${orderId}: ${err}`);
    }
  }
    async update(id: string, order: Order): Promise<Order> {
  try {
    const conn = await Client.connect();
    const sql = 'UPDATE orders SET status = $1, user_id = $2 WHERE id = $3 RETURNING *';
    const result = await conn.query(sql, [order.status, order.user_id, id]);
    conn.release();

    return result.rows[0];
  } catch (err) {
    throw new Error(`Could not update order ${id}. Error: ${err}`);
  }
}
async delete(id: string): Promise<Order> {
  try {
    const conn = await Client.connect();
    const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
    const result = await conn.query(sql, [id]);
    conn.release();

    return result.rows[0];
  } catch (err) {
    throw new Error(`Could not delete order ${id}. Error: ${err}`);
  }
}
async currentOrderByUser(userId: string): Promise<Order> {
  try {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM orders WHERE user_id = $1 AND status = $2';
    const result = await conn.query(sql, [userId, 'active']);
    conn.release();

    return result.rows[0];
  } catch (err) {
    throw new Error(`Could not find current order for user ${userId}. Error: ${err}`);
  }
}
async fiveMostRecentByUser(userId: string): Promise<Order[]> {
  try {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC LIMIT 5';
    const result = await conn.query(sql, [userId]);
    conn.release();

    return result.rows;
  } catch (err) {
    throw new Error(`Unable to get five most recent orders for user ${userId}. Error: ${err}`);
  }
}
}
