import { Response } from 'express';
import Stripe from 'stripe';
import User from '../models/user';
import Order from '../models/order';
import { ProductItem } from '../lib/model';

const webhook = async (req: any, res: Response) => {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: '2020-08-27'
	});
	const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

	let event: any;

	// Verify that event posted came from stripe
	const sig = req.headers['stripe-signature'];
	const payload = req.rawBody;
	try {
		event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret!);
	} catch (err) {
		return res.status(400).send(`Webhook error: ${(err as Error).message}`);
	}

	// Return 200 response to Stripe
	res.send();

	// handle checkout session completed event
	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;

		// fulfill the order...
		const user = await User.findById(session.metadata.userId).populate(
			'cart.items.productId'
		);
		const products = user.cart.items.map(
			(item: { productId: ProductItem; quantity: number }) => ({
				product: {
					title: item.productId.title,
					image: item.productId.image,
					price: item.productId.price,
					description: item.productId.description,
					quantity: item.productId.quantity
				},
				quantity: item.quantity
			})
		);

		// store the order in DB
		const order = new Order({
			products,
			userId: session.metadata.userId,
			totalAmount: session.amount_total / 100
		});
		await order.save();
		await user.clearCart();
	}
};

export default webhook;
