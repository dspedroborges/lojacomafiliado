import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { splitter } from './create';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const key = String(req.query.key);
        const decryptedId = key.split(splitter)[1];

        try {
            await prisma.payment.update({
                where: {
                    id: decryptedId,
                },
                data: {
                    paymentConfirmed: true,
                }
            });
            res.status(200).json({ error: false, content: "Pagamento confirmado com sucesso"});
        } catch (e) {
            res.status(400).json({ error: true, content: "Erro."});
        }

    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
