import express from 'express';
const router = express.Router();

import { add_crypto_symbol, add_crypto_to_wallet, get_crypto_balance } from '../../controllers/crypto.controller';


router.post('/add-crypto-symbol', add_crypto_symbol);
router.post('/add-crypto-to-wallet', add_crypto_to_wallet);
router.get('/get-crypto-balance', get_crypto_balance)

export default router;