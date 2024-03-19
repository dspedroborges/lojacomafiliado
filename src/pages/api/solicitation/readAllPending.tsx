import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export function sumArray(array: number[]) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        let result = await prisma.solicitation.findMany({
            where: {
                paid: false,
            },
            include: {
                affiliate: {
                    include: {
                        payments: {
                            where: {
                                affiliatePaid: false
                            }
                        }
                    }
                }
            }
        });
        
        let arrayOfCalculatedComissions = [];
        for (let i = 0; i < result.length; i++) {
            let sumOfAllPayments  = 0;
            for (let j = 0; j < result[i].affiliate.payments.length; j++) {
                sumOfAllPayments += sumArray(result[i].affiliate.payments[j].prices);
            }

            arrayOfCalculatedComissions.push(sumOfAllPayments * (result[i].affiliate.comission/100));
        }

        res.status(200).json([result, arrayOfCalculatedComissions])
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
