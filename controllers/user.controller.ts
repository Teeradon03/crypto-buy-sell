import { prisma } from "../lib/prisma";


const get_users = async (req: any, res: any) => {
    const users = await prisma.user.findMany();
    res.json(users);
}


const create_user = async (req: any, res: any) => {

    const { name, email, password, address } = req.body;
    // console.log('Received data:', { name, email, password, address });

    try {

        const email_duplicate = await prisma.user.findUnique({
            where: { email: email }
        })
        // console.log('Email duplicate check result:', email_duplicate);

        if (email_duplicate) {
            res.status(400).json({ error: "Email already exists" });
        }
        else {
            const user = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    password: password,
                    address: address,
                },
            });

            if (user) {
                // res.json({ message: "User created successfully", user });
                /// เก็บ transaction สร้าง user 
                // console.log('User created successfully:', user);
                const update_to_transaction = await prisma.transaction.create({
                    data: {
                        user_id: user.user_id,
                        transaction_type: "CREATE_USER",
                        amount: 1,
                        currency_type: "USER",
                    }
                })
                console.log('Transaction log for user creation:', update_to_transaction);
                if (!update_to_transaction) {
                    console.log('Failed to log transaction for user creation');
                } else {
                    res.json({ message: "User created successfully", user, transaction: update_to_transaction });
                }
            }
        }

        // res.json({ message: "User controller executed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}


export { get_users, create_user };