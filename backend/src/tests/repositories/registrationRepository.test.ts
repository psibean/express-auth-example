import { jest } from '@jest/globals';import UserRepository from '../../repositories/UserRepository';

import RegistrationRepository from '../../repositories/RegistrationRepository';
import db from '../../server/database';

const registrationRepository = new RegistrationRepository(new UserRepository());
const testEmail = 'test@example.com';
const testPassword = 'T3s7P@s$w0rd'

it('Generates appropriate signup key', async () => {
  const registration = await registrationRepository.signup(testEmail);
  expect(registration?.email).toBe(testEmail);
  const count = await db.registration.count();
  expect(count).toBe(1);
})

it('Throws invalid registration with invalid key', async () => {
  await expect(
    registrationRepository.register("123", testEmail, "passowrd", "password")
  ).rejects.toThrowError(RegistrationRepository.ERRORS.INVALID_REGISTRATION);
})

it('Throws invalid registration with invalid email', async() => {
  const registration = await db.registration.findUnique({ where: { email: testEmail }});
  expect(registration?.email).toBe(testEmail);
  await expect(
    registrationRepository.register(registration!.key, 'mismatch@example.com', 'password', 'password')
  ).rejects.toThrowError(RegistrationRepository.ERRORS.INVALID_REGISTRATION);
})

it('Throws password mismatch with mismatched passwords', async () => {
  const registration = await db.registration.findUnique({ where: { email: testEmail }})
  expect(registration?.email).toBe(testEmail);
  await expect(
    registrationRepository.register(registration!.key, testEmail, 'hello', 'world')
  ).rejects.toThrowError(RegistrationRepository.ERRORS.PASSWORD_MISMATCH);
})

it('Throws invalid password with weak password', async () => {
  const registration = await db.registration.findUnique({ where: { email: testEmail }})
  expect(registration?.email).toBe(testEmail);
  expect(
    registrationRepository.register(registration!.key, registration!.email, 'password', 'password')
    ).rejects.toThrowError(RegistrationRepository.ERRORS.INVALID_PASSWORD);
})

it('Can only register a user once', async () => {
  const registration = await db.registration.findUnique({ where: { email: testEmail }})
  await registrationRepository.register(registration!.key, registration!.email, testPassword, testPassword);
  await expect(
    registrationRepository.register(registration!.key, registration!.email, testPassword, testPassword)
  ).rejects.toThrowError(RegistrationRepository.ERRORS.ALREADY_REGISTERED);
})