import { ElementParams } from '../types';

export default function (params: ElementParams): HTMLElement {
    const element: HTMLElement = document.createElement(params.tag);

    // set classes
    element.classList.add(...params.classes);

    // set id
    if (typeof params.id === 'string') {
        element.id = params.id;
    }

    // set text
    if (typeof params.text === 'string') {
        element.textContent = params.text;
    }

    return element;
}
