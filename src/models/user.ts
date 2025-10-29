import {Pool} from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Client from "../db";


dotenv.config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});
const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = parseInt(process.env.SALT_ROUNDS as string);

export type User = {
  id?: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
};
export class UserStore{
    async index(): Promise<User[]> {
    const conn = await pool.connect();
    const result = await conn.query('SELECT * FROM users');
    conn.release();
    return result.rows;
  }
  async show(id: number): Promise<User> {
    const conn = await pool.connect();
    const result = await conn.query('SELECT * FROM users WHERE id = $1', [id]);
    conn.release();
    return result.rows[0];
  }
  async create(u: User): Promise<User> {
    try{
    const conn = await pool.connect();
    const hash = bcrypt.hashSync(u.password + pepper, saltRounds);
    const result = await conn.query(
      'INSERT INTO users (username, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *',
      [u.username, hash, u.firstname, u.lastname]
    );
    conn.release();
    return result.rows[0];
  }catch (err){
    throw new Error(`Unable to create user (${u.username}): ${err}`);
  }
    
}
async update(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE users SET username=$2, password=$3, firstname=$4, lastname=$5 WHERE id=$1 RETURNING *';
      const result = await conn.query(sql, [u.username, u.password, u.firstname, u.lastname, u.id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot update user ${u.id}: ${err}`);
    }
  }
  async delete(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete user ${id}: ${err}`);
    }
  }

async authenticate(username: string, password: string): Promise<User | null>{
    const conn = await pool.connect();
    const result = await conn.query('SELECT * FROM users WHERE username =1$', [username]);
    conn.release();

    if(result.rows.length){
        const user = result.rows[0];
        if(bcrypt.compareSync(password + pepper, user.password)){
            return user;
        }
    }
    return null;
}

}
