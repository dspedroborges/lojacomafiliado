import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { encryptPassword, normalizeString } from './create';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const id = String(req.query.id);
    let { username, password, passwordConfirmation, name, pix, tel, email, comission } = req.body

    username = normalizeString(username);
    const nickname = username;

    if (password !== passwordConfirmation) {
      res.status(400).json({ error: true, content: "Confirmação incorreta de senha" });
      return;
    }

    const userData = await prisma.user.findUnique({
      where: { username: String(username) }
    });

    if (username && password && name && pix && tel && email && comission) {
      await prisma.user.update({
        where: {
          id: userData?.id,
        },
        data: {
          username,
          password: await encryptPassword(password),
        },
      });
      await prisma.affiliate.update({
        where: { id },
        data: {
          name,
          nickname,
          pix,
          tel,
          email,
          comission: parseFloat(comission)
        }
      })

      res.status(200).json({ error: false, content: 'Atualizado com sucesso.' })
    } else {
      res.status(400).json({ error: true, content: 'ID inválido' })
    }
  } else {
    res.status(405).json({ error: true, content: 'Método não permitido' })
  }
}
