import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {User, UserStore} from '../models/user';
import { OrderStore } from '../models/order';



const store = new UserStore();
const tokenSec = process.env.TOKEN_SECRET as string;
const orderStore = new OrderStore();

// create new user
const create = async (req: Request, res: Response) => {
    try{
        const user: User = {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname:req.body.lastname,
        };

        const newUser = await store.create(user);
        const token = jwt.sign({user: newUser}, tokenSec);
        res.json({token});
    }catch(err){
        res.status(400).json({error: err});
    }
};
const authenticate = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const u = await store.authenticate(username, password);
    if (!u) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ user: u }, tokenSec);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: `${err}` });
  }
};

// get all users
const index = async (_req: Request, res: Response) => {
    try{
        const users = await store.index();
        res.json(users);
    }catch(err){
        res.status(500).json({error: err});
    }
};

// get single user
const show = async (req: Request, res: Response) => {
    try{
        const user = await store.show(parseInt(req.params.id));
        const recentOrders = await orderStore.fiveMostRecentByUser(req.params.id);
       res.json({
      user,
      recentPurchases: recentOrders
    });
    }catch(err){
        res.status(404).json({error: 'User not found'});
    }
};
//update sigle user
const update = async (req: Request, res: Response) => {
  try {
    const user: User = {
      id: parseInt(req.params.id),
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname:req.body.lastname,
    };
    const updatedUser = await store.update(user);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
};
// destroy user
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

const userRoutes = (app: express.Application)=> {
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:id', verifyAuthToken, show);
    app.post('/users', create);
    app.put('/users/:id', verifyAuthToken, update);
    app.delete('/users/:id', verifyAuthToken, destroy);
    app.post('/users/authenticate', authenticate);
};

export default userRoutes;