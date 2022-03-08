import passwordValidator from 'password-validator';
import db from '../server/database.js';
import UserController from './UserController.js';
import { randomBytes } from 'crypto';

export default class RegistrationController {
  public passwordSchema: passwordValidator;
  public userController: UserController;

  public static ERRORS = {
    ALREADY_REGISTERED: "ALREADY_REGISTERED",
    INVALID_REGISTRATION: "INVALID_REGISTRATION",
    INVALID_PASSWORD: "INVALID_PASSWORD",
    PASSWORD_MISMATCH: "PASSWORD_MISMATCH"
  }

  public static ERROR_MESSAGES = {
    [RegistrationController.ERRORS.ALREADY_REGISTERED]: "An error occurred trying to register the user.",
    [RegistrationController.ERRORS.INVALID_REGISTRATION]: "Invalid registration.",
    [RegistrationController.ERRORS.INVALID_PASSWORD]: "Password must meet the password requirements.",
    [RegistrationController.ERRORS.PASSWORD_MISMATCH]: "Password fields must match.",
  }

  public constructor(userController: UserController) {
    this.userController = userController;
    this.passwordSchema = new passwordValidator().is().min(8).is().max(128).has().uppercase().has().lowercase().has().digits(2).has().not().spaces();
  }

  public async signup(email: string) {
    const existingRegistration = await db.registration.findUnique({
      where: { email }
    });

    if (existingRegistration === undefined || existingRegistration?.userId === null) {
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

    throw Error(RegistrationController.ERRORS.ALREADY_REGISTERED);
  }

  public async register(key: string, email: string, password: string, confirmPassword: string) {
    const userRegistration = await db.registration.findFirst({
      where: {
        key, email
      }
    });

    if (userRegistration === null) {
      throw Error(RegistrationController.ERRORS.INVALID_REGISTRATION);
    }

    if (userRegistration.userId !== null) throw Error(RegistrationController.ERRORS.ALREADY_REGISTERED);

    if (password === confirmPassword) {
      if (!this.passwordSchema.validate(password)) {
        throw Error(RegistrationController.ERRORS.INVALID_PASSWORD);
      }
      return this.userController.createUser(email, password);
    } else {
      throw Error(RegistrationController.ERRORS.PASSWORD_MISMATCH);
    }
  }
}