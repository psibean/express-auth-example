import { Router } from 'express';
import UserRepository from '../repositories/UserRepository';
import RegistrationRepository from '../repositories/RegistrationRepository';
import RegistrationController from '../controllers/RegistrationController';

const userRepository = new UserRepository();
const registrationRepository = new RegistrationRepository(userRepository);

const registrationController = new RegistrationController(registrationRepository);

const registrationRouter = Router({
  caseSensitive: false,
});

registrationRouter.post('/signup/', registrationController.signup)
// registrationRouter.post('/register', register)

export default registrationRouter;