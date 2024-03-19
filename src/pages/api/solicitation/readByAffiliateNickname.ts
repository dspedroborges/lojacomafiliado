import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sumArray } from './readAllPending';

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
            let result = await prisma.payment.findMany({
                where: {
                    affiliateId: affiliateId?.id,
                    affiliatePaid: false,
                }
            });

            let arrayOfCalculatedComissions = [];
            let sumOfAllPayments = 0;
            for (let i = 0; i < result.length; i++) {
                sumOfAllPayments += sumArray(result[i].prices);
            }
            arrayOfCalculatedComissions.push(sumOfAllPayments * (affiliateId.comission / 100));
            res.status(200).json([result, arrayOfCalculatedComissions])
        } else {
            res.status(404).json({ error: true, content: 'Afiliado não encontrado.' })
        }
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
