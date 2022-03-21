import { Router } from 'express';

import * as productController from '../controllers/product';
import isAuth from '../middleware/is-auth';

const router = Router();

router.post('/create', isAuth, productController.createProduct);
router.post('/review/:prodId', isAuth, productController.postReview);
router.get('/', isAuth, productController.getProducts);
router.post('/cart', isAuth, productController.addToCart);
router.delete('/cart/:id', isAuth, productController.removeFromCart);
router.get('/cart', isAuth, productController.getCart);
router.put(
	'/cart/increment/:id',
	isAuth,
	productController.incrementItemQuantity
);
router.put(
	'/cart/decrement/:id',
	isAuth,
	productController.decrementItemQuantity
);
router.get('/orders', isAuth, productController.getOrders);
router.get('/invoice/:orderId', isAuth, productController.getInvoice);
router.get('/:id', isAuth, productController.getProduct);

export default router;
