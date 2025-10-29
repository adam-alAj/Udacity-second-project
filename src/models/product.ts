import Client from "../db";

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

export class ProductStore{
    async index(): Promise<Product[]>{
        try{
            const conn = await Client.connect();
            const sql = `SELECT * FROM products`;
            const result = await conn.query(sql);
            conn.release();
            return result.rows.map((row) => ({
            id: row.id, 
            name: row.name,
            price: parseFloat(row.price), 
            category: row.category,
        }));
        }catch (err) {
            throw new Error(`Cannot get products: ${err}`);
        }
    }
    async show(id: number): Promise<Product>{
        try{
            const conn = await Client.connect();
            const sql = `SELECT * FROM products WHERE id=($1)`;
            const result = await conn.query(sql, [id]);
            conn.release();
           return result.rows[0].map((row) => ({
            id: row.id, 
            name: row.name,
            price: parseFloat(row.price), 
            category: row.category,
        }));
        }catch(err){
            throw new Error(`Cannot find product ${id}: ${err}`);
        }

    }
    async create(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category]);
      conn.release();
      return result.rows[0].map((row) => ({
            id: row.id, 
            name: row.name,
            price: parseFloat(row.price), 
            category: row.category,
        }));
    } catch (err) {
      throw new Error(`Cannot add new product ${p.name}: ${err}`);
    }
  }
  async update(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE products SET name=$1, price=$2, category=$3 WHERE id=$4 RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category, p.id]);
      conn.release();
      return result.rows[0].map((row) => ({
            id: row.id, 
            name: row.name,
            price: parseFloat(row.price), 
            category: row.category,
        }));
    } catch (err) {
      throw new Error(`Cannot update product ${p.id}: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0].map((row) => ({
            id: row.id, 
            name: row.name,
            price: parseFloat(row.price), 
            category: row.category,
        }));
    } catch (err) {
      throw new Error(`Cannot delete product ${id}: ${err}`);
    }
  }
  async popularProducts(): Promise<Product[]> {
  try {
    const connection = await Client.connect();
    const sql = `
      SELECT products.id, products.name, products.price, COUNT(order_products.product_id) AS order_count
      FROM order_products
      JOIN products ON order_products.product_id = products.id
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 5;
    `;
    const result = await connection.query(sql);
    connection.release();
   return result.rows.map((row) => ({
            id: row.id, 
            name: row.name,
            price: parseFloat(row.price), 
            category: row.category,
        }));
  } catch (err) {
    throw new Error(`Unable to get popular products: ${err}`);
  }
}
}