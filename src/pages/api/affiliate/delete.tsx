import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const id = String(req.query.id);
    if (id) {
      const affiliateData = await prisma.affiliate.findUnique({
        where: {
          id,
        },
        select: {
          user: true,
        }
      });
      
      await prisma.user.delete({
        where: { id: affiliateData?.user.id },
      });
      
      res.status(200).json({error: false, content: 'Deletado com sucesso.'})
    } else {
      res.status(400).json({ error: true, content: 'ID inválido' })
    }
  } else {
    res.status(405).json({ error: true, content: 'Método não permitido' })
  }
}
