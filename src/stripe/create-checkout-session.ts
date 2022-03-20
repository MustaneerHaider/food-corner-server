import Stripe from 'stripe';
import { RequestHandler } from 'express';
import { ProductItem } from '../lib/model';

const createCheckoutSession: RequestHandler = async (req, res, _) => {
	// initialize stripe
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: '2020-08-27'
	});

	const { items, userId } = req.body as {
		items: ProductItem[];
		userId: string;
	};

	const transformedItems = items.map(item => ({
		description: item.description,
		quantity: item.quantity,
		price_data: {
			currency: 'pkr',
			unit_amount: item.price * 100,
			product_data: {
				name: item.title,
				images: [item.image]
			}
		}
	}));

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: transformedItems,
		mode: 'payment',
		success_url: `${process.env.HOST}/success`,
		cancel_url: `${process.env.HOST}/checkout`,
		metadata: {
			userId
		}
	});

	res.status(200).json({ id: session.id });
};

export default createCheckoutSession;
