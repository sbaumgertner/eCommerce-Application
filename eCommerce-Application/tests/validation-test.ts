import { Validation } from "../src/utils/validation";

test('Validation.checkText', () => {
  expect(Validation.checkText('AaПр').isValid).toBe(true);
  expect(Validation.checkText('Aa2').isValid).toBe(false);
});