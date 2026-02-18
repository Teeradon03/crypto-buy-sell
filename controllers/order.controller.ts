import { prisma } from "../lib/prisma";


const create_order_buy = async (req: any, res: any) => {
    const { user_id, fiat_id, crypto_id, amount, price, order_type } = req.body;
    console.log('Received order creation request:', user_id, fiat_id, crypto_id, amount, price, order_type);

    /* 

    1.ดูง่ามีเงินพอซื้อไหม
    2.ถ้ามีให้สร้าง order ขึ้นมา
    3.หาว่าเหรียญที่เราจะซื้อมีขายไหม ถ้ามีให้ทำการจับคู่ order กัน
    4.ส่งคำสั่งซื้อแล้วอัพเดท สถานะ order เป็น OPEN รอจับคู่
    5.ถ้าจับคู่ได้ให้ทำการอัพเดทยอดเงินในกระเป๋า fiat และ crypto ของผู้ซื้อและผู้ขาย และอัพเดทสถานะ order เป็น MATCHED
    6.

    1. 

    */

    try {
        const is_that_crypto_on_sell_order = await prisma.order.findFirst({
            where: {
                crypto_id: crypto_id,
                order_type: "SELL",
                order_status: "OPEN",
                amount: { gte: amount }
            }
        })

        console.log('is_that_crypto_on_sell_order:', is_that_crypto_on_sell_order);

        /* 
            จะจับคู่ต้อง 
            
            crypto เหมือนกัน
            order type ต้องเป็น sell กรณีที่เราซื้อ
            order status ต้องเป็น open
            amount ต้องมากกว่าหรือเท่ากับจำนวนที่เราต้องการซื้อ
            price เท่ากับที่เราตั้งไว้
    
        
        */
        if (!is_that_crypto_on_sell_order) {
            res.json({ message: "No matching sell order found for the specified crypto and price หรือก็ไม่มีคนขายนั่นเอง" });
        }
        if (is_that_crypto_on_sell_order && is_that_crypto_on_sell_order.crypto_id === crypto_id
            && is_that_crypto_on_sell_order.price === price
            && is_that_crypto_on_sell_order.amount >= amount
            && is_that_crypto_on_sell_order.order_type === "SELL"
            && is_that_crypto_on_sell_order.order_status === "OPEN"
        ) {
            // const sell_order = await prisma.order.findFirst({
            //     where: {
            //         crypto_id: is_that_crypto_on_sell_order.crypto_id,
            //         order_type: is_that_crypto_on_sell_order.order_type,
            //         order_status: is_that_crypto_on_sell_order.order_status,
            //         amount: { gte: is_that_crypto_on_sell_order.amount },
            //         price: price
            //     }
            // })
            // console.log('Sell order found for matching:', sell_order);
            // console.log(sell_order?.user_id)

            const get_fiat_wallet_id = await prisma.fiat_wallet.findFirst({
                where: {
                    user_id: user_id
                }
            })
            // console.log('Fiat wallet found for buy order:', get_fiat_wallet_id?.fiat_wallet_id);
            const get_crypto_wallet_id = await prisma.crypto_wallet.findFirst({

                where: {
                    user_id: user_id
                }
            })
            const fiat_wallet_id = Number(get_fiat_wallet_id?.fiat_wallet_id);
            const crypto_wallet_id = Number(get_crypto_wallet_id?.crypto_wallet_id);
            // console.log('Crypto wallet found for buy order:', get_crypto_wallet_id?.crypto_wallet_id);


            // console.log('Fiat wallet found for sell order:', get_fiat_wallet_id);)
            const buy_order = await prisma.order.create({
                data: {
                    user_id,
                    crypto_id,
                    fiat_id: fiat_id,
                    fiat_wallet_id: fiat_wallet_id,
                    crypto_wallet_id: crypto_wallet_id,
                    amount,
                    price,
                    order_type,
                    order_status: "OPEN",
                }
            })
            if (!buy_order) {
                res.status(400).json({ error: "Failed to create buy order" });
            } else {



                /* 
                    ถ้าจับคู่ได้ให้ทำการอัพเดทยอดเงินในกระเป๋า fiat และ crypto ของผู้ซื้อและผู้ขาย และอัพเดทสถานะ order เป็น MATCHED
                    แล้วไปเก็บันทึกการเทรดในตาราง Trade ด้วยว่าซื้อขายกันไปเท่าไหร่ ราคาเท่าไหร่
                
                */
                const update_to_transaction = await prisma.transaction.create({
                    data: {
                        user_id: user_id,
                        transaction_type: "BUY",
                        amount: amount,
                        currency_type: "CRYPTO",
                    }
                })

                const update_sell_order = await prisma.order.update({
                    where: {
                        order_id: is_that_crypto_on_sell_order.order_id,
                        order_type: "SELL"
                    },
                    data: {
                        order_status: "MATCHED"
                    }
                })
                /// เพิ่มเงินให้คนขาย ใน fiat wallet
                const update_sell_fail_wallet = await prisma.fiat_wallet.update({
                    where: {
                        fiat_wallet_id: is_that_crypto_on_sell_order.fiat_wallet_id
                    },
                    data: {
                        balance: {
                            increment: amount * price
                        }
                    }
                })
                /// ลัก crypto ออกจากคนขาย ใน crypto wallet
                const update_sell_crypto_wallet = await prisma.crypto_wallet.update({
                    where: {
                        crypto_wallet_id: is_that_crypto_on_sell_order.crypto_wallet_id
                    },
                    data: {
                        balance: {
                            decrement: amount
                        }
                    }
                })

                /// หักเงินจากคนซื้อ ใน fiat wallet
                const update_buy_fail_wallet = await prisma.fiat_wallet.update({
                    where: {
                        fiat_wallet_id: buy_order.fiat_wallet_id
                    },
                    data: {
                        balance: {
                            decrement: amount * price
                        }
                    }
                })
                /// เพิ่ม crypto ให้คนซื้อ ใน crypto wallet
                const update_buy_crypto_wallet = await prisma.crypto_wallet.update({
                    where: {
                        crypto_wallet_id: buy_order.crypto_wallet_id
                    },
                    data: {
                        balance: {
                            increment: amount
                        }

                    }
                })

                const update_trade = await prisma.trade.create({
                    data: {
                        buy_order_id: buy_order.order_id,
                        sell_order_id: is_that_crypto_on_sell_order.order_id,
                        amount: amount,
                        price: price,
                    }
                })
                /// อัพเดทสถานะ order เป็น MATCHED ทั้ง buy และ sell เนื่องจากจับคู่ได้แล้ว
                const update_buy_order = await prisma.order.update({
                    where: {
                        order_id: buy_order.order_id,
                        order_type: "BUY"
                    },
                    data: {
                        order_status: "MATCHED"
                    }
                })


            }
            res.json({ message: "Buy order created successfully", buy_order });
        }

    }
    catch (error) {
        console.log('Error during order creation:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
}


const create_order_sell = async (req: any, res: any) => {
    const { user_id, crypto_id, amount, price, order_type } = req.body;
    // console.log('Received order creation request:', user_id, crypto_id, amount, price, order_type);

    try {
        /// เช็คยอดเหรียญในกระเป๋า crypto ว่ามีเพียงพอที่จะขายบ่
        // console.log('Checking crypto wallet for user_id:', user_id, 'crypto_id:', crypto_id);
        const get_crypto_wallet = await prisma.crypto_wallet.findFirst({
            where: {
                user_id,
                crypto_id: crypto_id
            }
        })
        // console.log('Crypto wallet found:', get_crypto_wallet);

        /// ดึงข้อมูล fiat wallet id ของ user_id มาใช้ในการสร้าง order
        const get_fiat_wallet_id = await prisma.fiat_wallet.findFirst({
            where: {
                user_id: user_id
            }
        })
        // console.log('Fiat wallet found:', get_fiat_wallet_id);
        // console.log(typeof (get_crypto_wallet?.balance))
        // console.log(typeof (amount))
        /// todo สร้าง order ขาย
        // console.log(Boolean(get_crypto_wallet))
        // console.log(Boolean(get_crypto_wallet?.crypto_id === crypto_id))
        // console.log(Boolean(amount <= get_crypto_wallet?.balance!))

        if (get_crypto_wallet && get_crypto_wallet.crypto_id === crypto_id && amount <= get_crypto_wallet.balance) {
            console.log('get_crypto_wallet.balance:', get_crypto_wallet.balance);
            const open_order_sell = await prisma.order.create({
                data: {
                    user_id,
                    crypto_id,
                    fiat_wallet_id: get_fiat_wallet_id?.fiat_wallet_id!,
                    crypto_wallet_id: get_crypto_wallet.crypto_wallet_id,
                    amount,
                    price,
                    order_type: order_type,
                    order_status: "OPEN",
                    fiat_id: get_fiat_wallet_id?.fiat_id!,
                }
            })
            if (!open_order_sell) {
                res.status(400).json({ error: "Failed to create sell order" });
            } else {
                const update_to_transaction = await prisma.transaction.create({
                    data: {
                        user_id: user_id,
                        transaction_type: "SELL",
                        amount: amount,
                        currency_type: "CRYPTO",
                    }
                })
                res.json({ message: "Sell order created successfully", open_order_sell });
            }
        } else {
            res.json({ error: "Crypto mai phor" });
        }
    }
    catch (error) {
        console.log('Error during order creation:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }

}


const trade_order = async (req: any, res: any) => {

    try {

    } catch (error) {
        console.log('Error during trade order:', error);
        res.status(500).json({ error: 'Failed to trade order' });
    }

}




export { create_order_buy, create_order_sell }