import { jest } from '@jest/globals';import UserController from '../../controllers/UserController';

import RegistrationController from '../../controllers/RegistrationController';
import db from '../../server/database';

const registrationController = new RegistrationController(new UserController());
const testEmail = 'test@example.com';
const testPassword = 'T3s7P@s$w0rd'

it('Generates appropriate signup key', async () => {
  const registration = await registrationController.signup(testEmail);
  console.log("registration");
  expect(registration?.email).toBe(testEmail);
  const count = await db.registration.count();
  expect(count).toBe(1);
})

it('Throws invalid registration with invalid key', async () => {
  await expect(
    registrationController.register("123", testEmail, "passowrd", "password")
  ).rejects.toThrowError(RegistrationController.ERRORS.INVALID_REGISTRATION);
})

it('Throws invalid registration with invalid email', async() => {
  const registration = await db.registration.findUnique({ where: { email: testEmail }});
  expect(registration?.email).toBe(testEmail);
  await expect(
    registrationController.register(registration!.key, 'mismatch@example.com', 'password', 'password')
  ).rejects.toThrowError(RegistrationController.ERRORS.INVALID_REGISTRATION);
})

it('Throws password mismatch with mismatched passwords', async () => {
  const registration = await db.registration.findUnique({ where: { email: testEmail }})
  expect(registration?.email).toBe(testEmail);
  await expect(
    registrationController.register(registration!.key, testEmail, 'hello', 'world')
  ).rejects.toThrowError(RegistrationController.ERRORS.PASSWORD_MISMATCH);
})

it('Throws invalid password with weak password', async () => {
  const registration = await db.registration.findUnique({ where: { email: testEmail }})
  expect(registration?.email).toBe(testEmail);
  expect(
    registrationController.register(registration!.key, registration!.email, 'password', 'password')
    ).rejects.toThrowError(RegistrationController.ERRORS.INVALID_PASSWORD);
})

it('Can only register a user once', async () => {
  const registration = await db.registration.findUnique({ where: { email: testEmail }})
  await registrationController.register(registration!.key, registration!.email, testPassword, testPassword);
  await expect(
    registrationController.register(registration!.key, registration!.email, testPassword, testPassword)
  ).rejects.toThrowError(RegistrationController.ERRORS.ALREADY_REGISTERED);
})