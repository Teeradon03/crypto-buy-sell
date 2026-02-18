import express from 'express';
const router = express.Router();

import { create_order_buy, create_order_sell } from '../../controllers/order.controller';

router.post('/create-order-buy', create_order_buy);
router.post('/create-order-sell', create_order_sell);

export default router;
