import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const id = String(req.query.id);

        const result = await prisma.affiliate.findUnique({
            where: {
                id: id,
            },
            include: {
                user: true
            }
        });
        res.status(200).json(result)
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
