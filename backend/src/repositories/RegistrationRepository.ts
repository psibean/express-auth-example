import passwordValidator from 'password-validator';
import db from '../server/database.js';
import UserRepository from './UserRepository.js';
import { randomBytes } from 'crypto';

export default class RegistrationRepository {
  public passwordSchema: passwordValidator;
  public userRepository: UserRepository;

  public static ERRORS = {
    ALREADY_REGISTERED: "ALREADY_REGISTERED",
    INVALID_REGISTRATION: "INVALID_REGISTRATION",
    INVALID_PASSWORD: "INVALID_PASSWORD",
    PASSWORD_MISMATCH: "PASSWORD_MISMATCH"
  }

  public static ERROR_MESSAGES = {
    [RegistrationRepository.ERRORS.ALREADY_REGISTERED]: "An error occurred trying to register the user.",
    [RegistrationRepository.ERRORS.INVALID_REGISTRATION]: "Invalid registration.",
    [RegistrationRepository.ERRORS.INVALID_PASSWORD]: "Password must meet the password requirements.",
    [RegistrationRepository.ERRORS.PASSWORD_MISMATCH]: "Password fields must match.",
  }

  public constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.passwordSchema = new passwordValidator().is().min(8).is().max(128).has().uppercase().has().lowercase().has().digits(2).has().not().spaces();
  }

  public async signup(email: string) {
    const existingRegistration = await db.registration.findUnique({
      where: { email }
    });

    if (existingRegistration === null || existingRegistration.userId === null) {
      const newRegKey = randomBytes(32).toString("hex");
      return db.registration.upsert({
        create: {
          email,
          key: newRegKey,
        },
        update: {
          email,
          key: newRegKey
        },
        where: {
          email
        },
      });
    }

    throw Error(RegistrationRepository.ERRORS.ALREADY_REGISTERED);
  }

  public async register(key: string, email: string, password: string, confirmPassword: string) {
    const userRegistration = await db.registration.findFirst({
      where: {
        key, email
      }
    });

    if (userRegistration === null) {
      throw Error(RegistrationRepository.ERRORS.INVALID_REGISTRATION);
    }

    if (userRegistration.userId !== null) throw Error(RegistrationRepository.ERRORS.ALREADY_REGISTERED);

    if (password === confirmPassword) {
      if (!this.passwordSchema.validate(password)) {
        throw Error(RegistrationRepository.ERRORS.INVALID_PASSWORD);
      }
      return this.userRepository.createUser(email, password);
    } else {
      throw Error(RegistrationRepository.ERRORS.PASSWORD_MISMATCH);
    }
  }
}