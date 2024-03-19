import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const result = await prisma.payment.findMany({
            where: { sent: true }
        })
        res.status(200).json(result)
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
