// src/index.ts
import express from 'express';

import user from './src/routes/user.route'
import fiat_wallet from './src/routes/fiat.route'
import crypto from './src/routes/crypto.route'
import order from './src/routes/order.route'

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Use the router for routes starting with '/api/items'
app.use('/api/users', user);
app.use('/api/fiat-wallet', fiat_wallet)
app.use('/api/crypto', crypto)
app.use('/api/order', order)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
