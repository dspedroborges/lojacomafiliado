import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sumArray } from './readPendingById';

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

        let result = await prisma.solicitation.findMany({
            where: {
                affiliateId: affiliateId?.id,
            },
            include: {
                affiliate: true,
            }
        });

        res.status(200).json(result)
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
