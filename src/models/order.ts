import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
	{
		products: [
			{
				product: { type: Object, required: true },
				quantity: { type: Number, required: true }
			}
		],
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		totalAmount: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
);

export default model('Order', orderSchema);
