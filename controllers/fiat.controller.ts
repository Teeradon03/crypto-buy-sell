import { transaction_type } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";



const add_fiat_currency = async (req: any, res: any) => {
    const fiat_currency = "THB";

    try {

        const existing_currency = await prisma.fiat.findUnique({
            where: {
                currency: fiat_currency
            }
        })

        if (existing_currency) {
            res.status(400).json({ error: "Fiat currency already exists" });
            return;
        }

        const added_currency = await prisma.fiat.create({
            data: {
                currency: fiat_currency,
            },
        });
        if (!add_fiat_currency) {
            res.status(400).json({ error: "Failed to add fiat currency" });
        } else {
            res.json({ message: "Fiat currency added successfully", added_currency });
        }

    } catch (error) {
        console.log('Error adding fiat currency:', error);
        res.status(500).json({ error: "Internal server error" });
    }

}


const fiat_deposit = async (req: any, res: any) => {

    const { user_id, amount, fiat_id } = req.body;

    try {
        /// ตรวจสอบว่า user มี wallet อยู่แล้วหรือไม่ ถ้ามีให้ update ถ้าไม่มีให้สร้างใหม่
        const user_balance = await prisma.fiat_wallet.findFirst({
            where: {
                user_id: user_id,
            }
        })
        if (user_balance) {
            const update_transaction = await prisma.transaction.create({
                data: {
                    user_id: user_id,
                    transaction_type: "ADD_FIAT",
                    amount: amount,
                    currency_type: "FIAT",
                }
            })
            /// 
            if (user_balance?.user_id === user_id) {
                const updated_balance = await prisma.fiat_wallet.update({
                    where: {
                        fiat_wallet_id: user_balance?.fiat_wallet_id,
                        user_id: user_id,
                        balance: user_balance?.balance || 0,
                        fiat_id: fiat_id
                    },
                    data: {
                        balance: (user_balance?.balance || 0) + amount
                    }

                })
                if (!updated_balance) {
                    res.status(400).json({ error: "Failed to update fiat balance" });
                    return;
                }
                else {
                    const update_transaction = await prisma.transaction.create({
                        data: {
                            user_id: user_id,
                            transaction_type: "ADD_FIAT",
                            amount: amount,
                            currency_type: "FIAT",
                        }
                    })
                    res.json({ message: "Fiat balance updated successfully", updated_balance });
                }
            }
            else {
                /// สร้าง wallet ใหม่นะจ๊ะ
                const deposit = await prisma.fiat_wallet.create({
                    data: {
                        balance: amount,
                        fiat_id: fiat_id,
                        user_id: user_id
                    }
                })

                if (!deposit) {
                    res.status(400).json({ error: "Failed to deposit fiat" });

                } else {
                    const update_transaction = await prisma.transaction.create({
                        data: {
                            user_id: user_id,
                            transaction_type: "ADD_FIAT",
                            amount: amount,
                            currency_type: "FIAT",
                        }
                    })
                    res.json({ message: "Fiat deposited successfully", deposit });
                }
            }
        }
    } catch (error) {
        console.log('Error during fiat deposit:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}



export { fiat_deposit, add_fiat_currency };