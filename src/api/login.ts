import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
import { signToken } from "@/utils/jwt";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  console.log("xxxxxxxx", req.body)
  switch (req.method) {
    case 'POST':
      try {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
          where: { email: req.body.email }
        });
	console.log('dfadfsdaf', user);
        if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
          return res.status(401).json({
            message: 'Invalid email or password'
          });
        }
        console.log('2222222222', user);
        res.status(200)
	  .setCookie('token', await signToken(user.id))
          .json({ ...user, passwordHash: undefined });
        console.log('33333333-1');
        await prisma.$disconnect()
        console.log('33333333-2');
      } catch (error: any) {
        console.log('33333333', error);
        res.status(500).json(error);
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
