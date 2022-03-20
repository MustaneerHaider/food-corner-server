import { RequestHandler } from 'express';
import { ProductItem, ValidationError } from '../lib/model';

import Product from '../models/product';
import User from '../models/user';
import Order from '../models/order';
import Review from '../models/review';

export const createProduct: RequestHandler = async (req, res, next) => {
	const { title, image, price, description } = req.body as ProductItem;

	if (!title || !image || !price || !description) {
		const error = new ValidationError('Product data is missing.', 422);
		throw error;
	}

	try {
		const createdProduct = await Product.create({
			title,
			image,
			price,
			description,
			userId: req.userId
		});

		res.status(201).json({
			message: 'Product created.',
			prodId: createdProduct._id
		});
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const getProducts: RequestHandler = async (req, res, next) => {
	try {
		const products = await Product.find().select('-reviews');
		res.status(200).json({ products });
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const addToCart: RequestHandler = async (req, res, next) => {
	const prodId = req.body.id as { id: string };
	try {
		const user = await User.findOne({ _id: req.userId });
		await user.addToCart(prodId);
		res.status(200).json({ message: 'Item added to cart.' });
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const removeFromCart: RequestHandler<{ id: string }> = async (
	req,
	res,
	next
) => {
	try {
		const prodId = req.params.id;
		const user = await User.findById(req.userId);
		await user.removeFromCart(prodId);
		res.status(200).json({ message: 'Item removed from cart.' });
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const getCart: RequestHandler = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId).populate(
			'cart.items.productId'
		);
		const cartItems = user.cart.items;
		res.status(200).json({ items: cartItems });
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const incrementItemQuantity: RequestHandler<{ id: string }> = async (
	req,
	res,
	next
) => {
	try {
		const prodId = req.params.id;
		const user = await User.findById(req.userId);
		await user.incrementItemQty(prodId);
		res.status(200).json({
			message: `Product: ${prodId} quantity incremented.`
		});
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const decrementItemQuantity: RequestHandler<{ id: string }> = async (
	req,
	res,
	next
) => {
	try {
		const prodId = req.params.id;
		const user = await User.findById(req.userId);
		await user.decrementItemQty(prodId);
		res.status(200).json({
			message: `Product: ${prodId} quantity decremented.`
		});
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const getOrders: RequestHandler = async (req, res, next) => {
	try {
		const orders = await Order.find({ userId: req.userId }).sort({
			createdAt: -1
		});
		res.status(200).json({ orders });
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const getProduct: RequestHandler<{ id: string }> = async (
	req,
	res,
	next
) => {
	try {
		const product = await Product.findById(req.params.id).populate(
			'reviews.reviewId'
		);
		res.status(200).json({ prod: product });
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};

export const postReview: RequestHandler<{ prodId: string }> = async (
	req,
	res,
	next
) => {
	const { review, name } = req.body as { review: string; name: string };
	try {
		const createdReview = await Review.create({
			review,
			userName: name,
			prodId: req.params.prodId
		});
		const product = await Product.findById(req.params.prodId);
		product.reviews.push({ reviewId: createdReview._id });
		await product.save();
		res.status(200).json({ message: 'Review added.' });
	} catch (err: any) {
		err.statusCode = 500;
		next(err);
	}
};
