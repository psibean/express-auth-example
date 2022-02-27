import prisma from '../server/database.js';
import { hash } from 'argon2';

export default class UserController {
  public async createUser(email: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        registrationKey: {
          connect: {
              email
            }
        },
        passwordHistory: {
          create: [
            { password: hashedPassword }
          ]
        }
      },
      include: {
        registrationKey: true,
        passwordHistory: true,
      }
    });
  }

  public hashPassword(password: string) {
    return hash(password)
  }
}