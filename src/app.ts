import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import { ValidationError } from './lib/model';
import createCheckoutSession from './stripe/create-checkout-session';
import isAuth from './middleware/is-auth';
import webhook from './stripe/webhook';

dotenv.config();
const app = express();

app.use(
	express.json({
		verify(req: any, res, buf) {
			req.rawBody = buf;
		}
	})
);
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// stripe routes
app.post('/api/create-checkout-session', isAuth, createCheckoutSession);
app.post('/api/webhook', webhook);

app.use((err: ValidationError, _: Request, res: Response, _2: NextFunction) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'An error occured!';
	res.status(statusCode).json({ message });
});

mongoose
	.connect(process.env.MONGO_URI!)
	.then(_ => {
		app.listen(process.env.PORT || 5000);
	})
	.catch(console.error);
