import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
export const splitter = "31d6cfe0d16ae931b73c59d7e0c089c0";

export const createRandomString = (size: number) => {
    let string: string[] = [];
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    for (let i = 0; i < size; i++) {
        string.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    return string.join("");
}

const priceByProductName: Record<string, number> = {
    "Produto 1": 60.0,
    "Produto 2": 100.0,
}

const priceInCentsByProductName: Record<string, number> = {
    "Produto 1": 60.0 * 100,
    "Produto 2": 100.0 * 100,
}

const parseProductToStripe = (productName: string, amount: number) => {
    return {
        price_data: {
            currency: "BRL",
            product_data: {
                name: productName,
            },
            unit_amount: priceInCentsByProductName[productName],
        },
        quantity: amount
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        let { affiliate, products, amounts, name, email, tel, cpf, cep, state, city, neighborhood, address, number, complement } = req.body;

        // definições para salvar no banco de dados
        products = products.split(",");
        const prices = products.map((product: string) => {
            return priceByProductName[product];
        });
        const amountsInt = amounts.split(",").map((amount: string) => {
            return parseInt(amount);
        });

        let affiliateId;
        if (affiliate) {
            affiliateId = await prisma.affiliate.findUnique({
                where: {
                    nickname: affiliate
                },
                select: {
                    id: true
                }
            });
        }

        console.log(affiliate);
        console.log(affiliateId);

        if (products && amounts && name && email && tel && cpf && cep && state && city && neighborhood && address && number && complement) {
            let createdPayment;
            if (affiliateId) {
                createdPayment = await prisma.payment.create({
                    data: { affiliateId: affiliateId.id, products, amounts: amountsInt, prices, name, email, tel, cpf, cep, state, city, neighborhood, address, number, complement: complement ?? "" }
                });
            } else {
                createdPayment = await prisma.payment.create({
                    data: { products, amounts: amountsInt, prices, name, email, tel, cpf, cep, state, city, neighborhood, address, number, complement: complement ?? "" }
                });
            }

            // definições para gerar url de pagamento stripe
            const splitProducts = String(products).split(",");
            const splitAmounts = String(amounts).split(",");
            let stripeProducts = [];
            for (let i = 0; i < splitProducts.length; i++) {
                stripeProducts.push(parseProductToStripe(splitProducts[i], Number(splitAmounts[i])));
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment", // subscription
                line_items: stripeProducts,
                success_url: `${process.env.SERVER_URL}/sucesso?key=${createRandomString(32)+splitter+createdPayment.id}`,
                cancel_url: `${process.env.SERVER_URL}/cancelamento`,
            });

            res.status(201).json({ error: false, content: 'Informações registradas com sucesso', url: session.url });
        } else {
            res.status(400).json({ error: true, content: 'Dados inválidos' })
        }
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
