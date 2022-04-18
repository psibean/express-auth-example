import type { Request, Response } from 'express';
import RegistrationRepository from '../repositories/RegistrationRepository';

export default class RegistrationController {
  private registrationRepository: RegistrationRepository;

  public constructor(registrationRepository: RegistrationRepository) {
    this.registrationRepository = registrationRepository;
  }

  public async signup(req: Request, res: Response) {
    console.log("SIGNUP");
    const { email } = req.body;
    if (email === undefined) {
      return res.status(400).send();
    }

    try {
      await this.registrationRepository.signup(email);
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}