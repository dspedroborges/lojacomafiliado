import prisma from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
const bcrypt = require('bcryptjs')

export function normalizeString(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function encryptPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw new Error('Error trying to encrypt password.');
    }
  }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        let { username, password, passwordConfirmation, name, pix, tel, email, comission } = req.body

        if (username && password && name && pix && tel && email && comission) {
            username = normalizeString(username);
            const nickname = username; 

            if (password !== passwordConfirmation && password !== "") {
                res.status(400).json({ error: true, content: "Confirmação incorreta de senha" });
                return;
            }

            const usernameAlreadyRegistered = await prisma.user.findUnique({
                where: { username: String(username) }
            });
            const affiliateDataAlreadyRegistered = await prisma.affiliate.findFirst({
                where: {
                  OR: [
                    { nickname },
                    { email },
                    { tel },
                    { pix }
                  ]
                }
              });

            if (!usernameAlreadyRegistered && !affiliateDataAlreadyRegistered) {
                const createdUser = await prisma.user.create({
                    data: {
                        username,
                        password: await encryptPassword(password),
                        role: "AFFILIATE"
                    },
                });
                await prisma.affiliate.create({
                    data: {
                        userId: createdUser.id,
                        name,
                        nickname,
                        pix,
                        tel,
                        email,
                        comission: parseFloat(comission)
                    }
                });
                res.status(201).json({ error: false, content: "Cadastrado com sucesso." })
            } else {
                res.status(400).json({ error: true, content: "Já existe um usuário ou afiliado cadastrado com esses dados." })
            }
        } else {
            res.status(400).json({ error: true, content: 'Dados inválidos' })
        }
    } else {
        res.status(405).json({ error: true, content: 'Método não permitido' })
    }
}
