import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sumArray } from './readAllPending';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { nickname } = req.body

        const affiliateId = await prisma.affiliate.findUnique({
            where: {
                nickname,
            },
            select: {
                id: true,
                comission: true,
            }
        });

        const checkSolicitation = await prisma.solicitation.findFirst({
            where: {
                affiliateId: affiliateId?.id,
                paid: false,
            },
            select: {
                id: true
            }
        });

        let calculatedComission = 0;
        if (affiliateId) {
            let checkPayment = await prisma.payment.findMany({
                where: {
                    affiliateId: affiliateId?.id,
                    affiliatePaid: false,
                }
            });

            let sumOfAllPayments = 0;
            for (let i = 0; i < checkPayment.length; i++) {
                sumOfAllPayments += sumArray(checkPayment[i].prices);
            }
            calculatedComission = sumOfAllPayments * (affiliateId.comission / 100);

            if (checkSolicitation) {
                res.status(400).json({ error: true, content: "Você não pode solicitar um saque com saldo zerado." });
                return;
            }
        }

        if (checkSolicitation) {
            res.status(400).json({ error: true, content: 'Você já tem uma solicitação pendente. Por favor, aguarde.' });
            return;
        }

        if (affiliateId) {
            await prisma.solicitation.create({
                data: {
                    affiliateId: affiliateId.id,
                    comission: calculatedComission,
                },
            });
            res.status(201).json({ error: false, content: "Solicitação enviada com sucesso. Por favor, aguarde." })
        } else {
            res.status(400).json({ error: true, content: 'Dados inválidos' })
        }
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
