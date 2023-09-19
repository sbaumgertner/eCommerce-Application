/**
 * @jest-environment jsdom
 */

import { Chips } from '../../src/components/chips/chips';

test('renders the chips component without image', () => {
    const text = 'Chips Text';

    const chips = new Chips(text);

    const chipsElem = chips.getComponent();

    expect(chipsElem.tagName).toBe('DIV');
    expect(chipsElem.classList.contains('chips')).toBe(true);

    const textEl = chipsElem.querySelector('.chips__text');
    expect(textEl?.textContent).toBe(text);

    const imgEl = chipsElem.querySelector('.chips__img');
    expect(imgEl).toBeNull();
});

test('renders the chips component with image', () => {
    const text = 'Chips Text';
    const imgSrc = 'path/to/image.jpg';

    const chips = new Chips(text, imgSrc);

    const chipsElem = chips.getComponent();

    expect(chipsElem?.classList.contains('chips')).toBe(true);

    const textEl = chipsElem.querySelector('.chips__text');
    expect(textEl?.classList.contains('chips__text_left')).toBe(true);
    expect(textEl?.textContent).toBe(text);

    const imgEl = chipsElem.querySelector('.chips__img');
    expect(imgEl?.tagName).toBe('IMG');
    expect(imgEl?.getAttribute('src')).toBe(imgSrc);
});
