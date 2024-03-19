import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'PUT') {
        const solicitationId = Number(req.body.solicitationId);

        if (solicitationId) {
            await prisma.solicitation.update({
                where: { id: solicitationId },
                data: {
                    paid: true,
                }
            })
        }

        const solicitationData = await prisma.solicitation.findUnique({
            where: {
                id: solicitationId
            },
            include: {
                affiliate: true,
            }
        });

        await prisma.payment.updateMany({
            where: {
                affiliateId: solicitationData?.affiliate.id,
            },
            data: {
                affiliatePaid: true,
            }
        });

        res.status(200).json({ error: false, content: 'Atualizado com sucesso.' })
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
