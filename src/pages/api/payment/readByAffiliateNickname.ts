import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        let nickname = String(req.query.nickname);
        const affiliateId = await prisma.affiliate.findUnique({
            where: {
                nickname,
            },
            select: {
                id: true
            }
        });

        if (affiliateId) {
            const result = await prisma.payment.findMany({
                where: {
                    affiliateId: affiliateId.id,
                    affiliatePaid: false,
                    paymentConfirmed: true,
                }
            })
            res.status(200).json(result)
        } else {
            res.status(404).json({ error: true, content: 'Esse afiliado não existe' })
        }
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
