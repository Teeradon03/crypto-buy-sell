import { prisma } from "../lib/prisma"

async function main() {
    // users
    const user1 = await prisma.user.create({
        data: {
            email: 'test1@example.com',
            name: 'test1',
            password: 'password1',
            address: 'Bangkok'
        }
    })

    const user2 = await prisma.user.create({
        data: {
            email: 'test2@example.com',
            name: 'test2',
            password: 'password2',
            address: 'Bangkok2'
        }
    })

    const btc = await prisma.crypto.create({
        data: {
            symbol: "BTC",
        }
    })

    const eth = await prisma.crypto.create({
        data: {
            symbol: "ETH",
        }
    })
    const xrp = await prisma.crypto.create({
        data: {
            symbol: "XRP",
        }
    })

    const doge = await prisma.crypto.create({
        data: {
            symbol: "DOGE",
        }
    })

    const thb = await prisma.fiat.create({
        data: {
            currency: "THB",
        }
    })

    const usd = await prisma.fiat.create({
        data: {
            currency: "USD",
        }
    })

    const fait_wallet_user1 = await prisma.fiat_wallet.create({
        data: {
            user_id: 1,
            balance: 5000,
            fiat_id: 1
        }
    })

    const fait_wallet_user2 = await prisma.fiat_wallet.create({
        data: {
            user_id: 2,
            balance: 10000,
            fiat_id: 1
        }
    })

    const crypto_wallet_user1 = await prisma.crypto_wallet.create({
        data: {
            user_id: 1,
            balance: 2,
            crypto_id: 1
        }
    })

    const crypto_wallet_user2 = await prisma.crypto_wallet.create({
        data: {
            user_id: 2,
            balance: 3,
            crypto_id: 1
        }
    })

    const order_buy_user1 = await prisma.order.create({
        data: {
            user_id: 1,
            order_type: "BUY",
            amount: 1,
            price: 3000,
            order_status: "OPEN",
            fiat_id: 1,
            crypto_id: 1,
            crypto_wallet_id: 1,
            fiat_wallet_id: 1
        }
    })

    const order_sell_user2 = await prisma.order.create({
        data: {
            user_id: 2,
            order_type: "SELL",
            amount: 1,
            price: 3000,
            order_status: "OPEN",
            fiat_id: 1,
            crypto_id: 1,
            crypto_wallet_id: 2,
            fiat_wallet_id: 2
        }
    })






}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => prisma.$disconnect())
