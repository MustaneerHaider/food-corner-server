import { Schema, model } from 'mongoose';
import { ProductItem } from '../lib/model';

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product'
				},
				quantity: Number
			}
		]
	}
});

userSchema.methods.addToCart = function (prodId: string) {
	const updatedCartItems = [...this.cart.items];
	const itemIndex = this.cart.items.findIndex(
		(p: any) => p.productId.toString() === prodId.toString()
	);

	if (itemIndex >= 0) {
		updatedCartItems[itemIndex].quantity++;
	} else {
		updatedCartItems.push({ productId: prodId, quantity: 1 });
	}

	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.removeFromCart = function (prodId: string) {
	const updatedCartItems = this.cart.items.filter(
		(p: any) => p.productId.toString() !== prodId.toString()
	);

	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

userSchema.methods.incrementItemQty = function (prodId: string) {
	const itemIndex = this.cart.items.findIndex(
		(p: any) => p.productId.toString() === prodId.toString()
	);
	const updatedCartItems = [...this.cart.items];
	updatedCartItems[itemIndex].quantity++;

	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.decrementItemQty = function (prodId: string) {
	const itemIndex = this.cart.items.findIndex(
		(p: any) => p.productId.toString() === prodId.toString()
	);
	const updatedCartItems = [...this.cart.items];
	if (updatedCartItems[itemIndex].quantity === 1) {
		updatedCartItems.splice(itemIndex, 1);
	} else {
		updatedCartItems[itemIndex].quantity--;
	}

	this.cart.items = updatedCartItems;
	return this.save();
};

export default model('User', userSchema);
