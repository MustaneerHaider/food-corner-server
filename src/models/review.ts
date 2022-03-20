import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
	review: {
		type: String,
		required: true
	},
	userName: String,
	prodId: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	}
});

export default model('Review', reviewSchema);
