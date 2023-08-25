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

test('Validation.checkDate', () => {
  expect(Validation.checkDate('12.08.1985').isValid).toBe(true);
  expect(Validation.checkDate('12.08.2020').isValid).toBe(false);
});

test('Validation.checkCountry', () => {
  expect(Validation.checkCountry('RU').isValid).toBe(true);
  expect(Validation.checkCountry('EN').isValid).toBe(false);
});

test('Validation.checkZip', () => {
  expect(Validation.checkZip('r4f4rr', 'RU').isValid).toBe(false);
  expect(Validation.checkZip('456789', 'RU').isValid).toBe(true);
  expect(Validation.checkZip('675678', 'GE').isValid).toBe(false);
  expect(Validation.checkZip('6756', 'GE').isValid).toBe(true);
});

