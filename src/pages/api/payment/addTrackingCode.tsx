import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const id = String(req.query.id);
    const trackingCode = req.body.trackingCode;

    console.log(trackingCode);

    if (id && trackingCode) {
        await prisma.payment.update({
          where: { id },
          data: {
            trackingCode,
            sent: true,
          },
        })

        res.status(200).json({error: false, content: 'Atualizado com sucesso.'})
    } else {
      res.status(400).json({ error: true, content: 'ID inválido' })
    }
  } else {
    res.status(405).json({ error: true, content: 'Método não permitido' })
  }
}
