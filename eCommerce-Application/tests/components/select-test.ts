/**
 * @jest-environment jsdom
 */

import { Select } from "../../src/components/select/select";

test('select.constructor', () => {
  const select = new Select({
    classes: ['select'],
    id: 'select',
    placeholder: 'select country',
    options: new Map([['RU', 'Russia'],
    ['BY', 'Belarus'],
    ['GE', 'Georgia']])
  });
  const el = select.getComponent();
  
  expect(el.classList.contains('select')).toBe(true);
  expect(el.id).toBe('select');
  expect(el.childNodes.length).toBe(4);
});

test('select.setError', () => {
  const select = new Select({
    classes: ['select'],
    id: 'select',
    placeholder: 'select country',
    options: new Map([['RU', 'Russia'],
    ['BY', 'Belarus'],
    ['GE', 'Georgia']])
  });
  select.setError(true);
  const el = select.getComponent();
  
  expect(el.classList.contains('input_invalid')).toBe(true);
});