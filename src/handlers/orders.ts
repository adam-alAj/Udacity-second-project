import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import jwt from 'jsonwebtoken';

const store = new OrderStore();
const tokenSec = process.env.TOKEN_SECRET as string;

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

const show = async (req: Request, res: Response) => {
  const order = await store.show(parseInt(req.params.id));
  res.json(order);
};

const create = async (req: Request, res: Response) => {
  const order: Order = {
    status: req.body.status,
    user_id: req.body.user_id,
  };
  const newOrder = await store.create(order);
  res.json(newOrder);
};

const addProduct = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  const productId = parseInt(req.body.product_id);
  const quantity = parseInt(req.body.quantity);
  const addedProduct = await store.addProduct(quantity, orderId, productId);
  res.json(addedProduct);
};
const update = async (req: Request, res: Response) => {
  try {
    const updated = await store.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json(err);
  }
};
const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(400).json(err);
  }
};
const currentOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;
    const order = await store.currentOrderByUser(userId);
    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};
const verifyAuthToken = (req: Request, res: Response, next: Function) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1];
    jwt.verify(token as string, tokenSec);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Access denied, invalid token' });
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.post('/orders/:id/products', addProduct);
   app.put('/orders/:id', verifyAuthToken, update);
  app.delete('/orders/:id', verifyAuthToken, destroy);
  app.get('/users/:user_id/orders/current', verifyAuthToken, currentOrderByUser);
};

export default orderRoutes;
