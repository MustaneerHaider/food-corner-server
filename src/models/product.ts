import { Schema, model } from 'mongoose';

const productSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		reviews: [{ reviewId: { type: Schema.Types.ObjectId, ref: 'Review' } }]
	},
	{ timestamps: true }
);

export default model('Product', productSchema);
