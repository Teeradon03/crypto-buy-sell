import express from 'express';

const router = express.Router();

import { fiat_deposit } from '../../controllers/fiat.controller';
import { add_fiat_currency } from '../../controllers/fiat.controller';

router.post('/add-fiat-currency', add_fiat_currency)
router.post('/fiat-deposit', fiat_deposit)


export default router;