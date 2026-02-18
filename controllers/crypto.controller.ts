
import { prisma } from "../lib/prisma";


const add_crypto_symbol = async (req: any, res: any) => {
    const crypto_symbol = "BTC";
    const network = "Bitcoin";

    try {

        const existing_crypto = await prisma.crypto.findUnique({
            where: {
                symbol: crypto_symbol
            }
        })

        if (existing_crypto) {
            res.status(400).json({ error: "Crypto symbol already exists" });
            return;
        }

        const added_crypto = await prisma.crypto.create({
            data: {
                symbol: crypto_symbol,
                network: network
            },
        });
        if (!added_crypto) {
            res.status(400).json({ error: "Failed to add crypto symbol" });
        } else {
            res.json({ message: "Crypto symbol added successfully", added_crypto });
        }

    } catch (error) {
        console.log('Error adding crypto symbol:', error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const add_crypto_to_wallet = async (req: any, res: any) => {
    const { user_id, crypto_id, amount } = req.body;

    try {
        // console.log('Adding crypto to wallet for user_id:', user_id, 'crypto_id:', crypto_id, 'amount:', amount);
        const crypto_wallet = await prisma.crypto_wallet.findFirst({
            where: {
                user_id: user_id,
                crypto_id: crypto_id
            }
        })
        // console.log('Crypto wallet found:', crypto_wallet);
        /// ตรวจสอบว่า user มี wallet อยู่แล้วหรือไม่ ถ้ามีให้ update ถ้าไม่มีให้สร้างใหม่
        if (crypto_wallet?.user_id === user_id && crypto_wallet?.crypto_id === crypto_id) {
            const update_balance = await prisma.crypto_wallet.update({
                where: {
                    crypto_wallet_id: crypto_wallet?.crypto_wallet_id || 0
                },
                data: {
                    balance: (crypto_wallet?.balance || 0) + amount
                }
            })

            if (!update_balance) {
                res.status(400).json({ error: "Failed to update crypto balance in wallet" });
            } else {

                res.json({ message: "Crypto balance in wallet updated successfully", update_balance });
            }
        } else {
            /// ถ้าไม่มี wallet ให้สร้างใหม่ แล้วเพิ่ม crypto เข้าไป
            const create_crypto_wallet = await prisma.crypto_wallet.create({
                data: {
                    user_id,
                    crypto_id,
                    balance: amount
                }
            })
            if (!create_crypto_wallet) {
                res.status(400).json({ error: "Failed to create crypto wallet and add crypto" });
            } else {
                const update_crypto_wallet = await prisma.transaction.create({
                    data: {
                        user_id: user_id,
                        transaction_type: "ADD_CRYPTO",
                        amount: amount,
                        currency_type: "CRYPTO",
                    }
                })
                res.json({ message: "Crypto wallet created and crypto added successfully", create_crypto_wallet });
            }
        }

        res.json({ message: "Crypto added to wallet successfully" });

    } catch (error) {
        console.log('Error checking crypto in wallet:', error);
        res.status(500).json({ error: "Internal server error" });
    }


}



const get_crypto_balance = async (req: any, res: any) => {
    const { user_id, crypto_id } = req.body;
    // console.log('Checking crypto in wallet for user_id:', user_id, 'and crypto_id:', crypto_id);

    try {
        const crypto_wallet = await prisma.crypto_wallet.findFirst({
            where: {
                user_id: user_id,
                crypto_id: crypto_id
            }
        })

        if (crypto_wallet) {
            console.log('Crypto balance in wallet:', crypto_wallet);
            res.json({ message: "Crypto found in wallet", crypto_wallet });
        } else {
            res.status(404).json({ error: "Crypto not found in wallet" });
        }


    } catch (error) {
        console.log('Error checking crypto in wallet:', error);
        res.status(500).json({ error: "Internal server error" });
    }

}



export { add_crypto_symbol, get_crypto_balance, add_crypto_to_wallet }