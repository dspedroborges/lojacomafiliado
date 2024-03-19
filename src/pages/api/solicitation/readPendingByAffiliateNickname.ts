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
                id: true,
                comission: true,
            }
        });

        if (affiliateId) {
            const result = await prisma.solicitation.findMany({
                where: {
                    affiliateId: affiliateId.id,
                    paid: false,
                }
            });
            res.status(200).json(result)
        } else {
            res.status(404).json({ error: true, content: "Afiliado não encontrado" })
        }
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
