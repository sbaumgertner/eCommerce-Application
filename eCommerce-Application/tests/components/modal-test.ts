/**
 * @jest-environment jsdom
 */

import { Modal } from "../../src/components/modal/modal";

test('modal.constructor', () => {
  const modal = new Modal(document.createElement('p'));

  const contentEl = modal.getComponent().querySelector('.modal__content')?.querySelector('p');
  expect(contentEl).toBeTruthy();

  modal.openModal();
  expect(document.querySelector('.modal')).toBeTruthy();
});