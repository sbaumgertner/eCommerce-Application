import { Validation } from "../src/utils/validation";

test('Validation.checkText', () => {
  expect(Validation.checkText('AaПр').isValid).toBe(true);
  expect(Validation.checkText('Aa2').isValid).toBe(false);
});

test('Validation.checkEmail', () => {
  expect(Validation.checkEmail('test@test.com').isValid).toBe(true);
  expect(Validation.checkEmail('test @test. com').isValid).toBe(false);
});

test('Validation.checkPassword', () => {
  expect(Validation.checkPassword('Test123!').isValid).toBe(true);
  expect(Validation.checkPassword('12345').isValid).toBe(false);
});
