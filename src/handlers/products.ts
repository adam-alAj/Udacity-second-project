import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import jwt from 'jsonwebtoken';



const store = new ProductStore();
const tokenSec = process.env.TOKEN_SECRET as string;


const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      id: parseInt(req.params.id),
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const updatedProduct = await store.update(product);
    res.json(updatedProduct);
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
const popularProducts = async (_req: Request, res: Response) => {
  try {
    const products = await store.popularProducts();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json({ error: (err as Error).message });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
  app.put('/products/:id', verifyAuthToken, update);
  app.delete('/products/:id', verifyAuthToken, destroy);
  app.get('/products/popular', popularProducts);

};

export default productRoutes;
