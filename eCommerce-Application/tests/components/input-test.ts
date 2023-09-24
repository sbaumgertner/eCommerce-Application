/**
 * @jest-environment jsdom
 */
import Input from "../../src/components/input/input";
import { InputElementParams } from "../../src/types";

describe('Input', () => {
  let input: Input;

  beforeEach(() => {
    // Create a temporary container element for testing
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Instantiate the Input component
    const inputParams: InputElementParams = {
      classes: ['my-input'],
      id: 'inputId',
      type: 'text',
      name: 'inputName',
      placeholder: 'Enter your name',
    };
    input = new Input(inputParams);
    container.appendChild(input.getComponent());
  });

  afterEach(() => {
    // Clean up the temporary container element
    input.getComponent().remove();
  });

  test('getValue method should return the input value', () => {
    const inputValue = 'Test Value';
    input.getComponent().value = inputValue;
    expect(input.getValue()).toBe(inputValue);
  });

  test('setError method should add "input_invalid" class when isError is true', () => {
    expect(input.getComponent().classList.contains('input_invalid')).toBe(false);
    
    input.setError(true);

    expect(input.getComponent().classList.contains('input_invalid')).toBe(true);
  });

  test('setError method should remove "input_invalid" class when isError is false', () => {
    input.getComponent().classList.add('input_invalid');
    expect(input.getComponent().classList.contains('input_invalid')).toBe(true);
    
    input.setError(false);

    expect(input.getComponent().classList.contains('input_invalid')).toBe(false);
  });
});
