/**
 * @jest-environment jsdom
 */

import { Button } from "../../src/components/button/button";

test('button.constructor', () => {
  const button = new Button('filled', 'id', 'button');
  const el = button.getComponent();
  
  expect(el.classList.contains('button_filled')).toBe(true);
  expect(el.id).toBe('id');
  expect(el.textContent).toBe('button');
});

test('button.disable', () => {
  const button = new Button('filled', 'id', 'button');
  button.disable();
  const el = button.getComponent();
  
  expect(el.disabled).toBe(true);
});

