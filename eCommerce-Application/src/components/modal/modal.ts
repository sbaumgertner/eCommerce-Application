import './modal.scss';
import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { IconButton } from '../button/button';

import closeIcon from '../../assets/icons/icon-close.svg';

export class Modal extends Component {
    private modal: HTMLElement;
    private closeBtn: IconButton;
    private content: HTMLElement;

    constructor(content: HTMLElement) {
        super({ tag: 'div', classes: ['overlay'] });
        this.modal = createElement({ tag: 'div', classes: ['modal'] });
        this.closeBtn = new IconButton({ icon: closeIcon, type: 'clear', id: 'close-modal' });
        this.closeBtn.getComponent().classList.add('modal__close-icon');

        this.content = createElement({ tag: 'div', classes: ['modal__content'] });
        this.content.appendChild(content);

        this.getComponent().append(this.modal);
        this.modal.append(this.closeBtn.getComponent());
        this.modal.append(this.content);

        this.bindEvents();
    }

    private bindEvents(): void {
        this.closeBtn.getComponent().addEventListener('click', this.closeModal);
        this.getComponent().addEventListener('click', this.closeModal);
    }

    public openModal(): void {
        document.body.append(this.getComponent());
    }

    private closeModal(event: Event): void {
        const classes = (event.target as HTMLElement).classList;
        if (classes.contains('overlay') || (event.target as HTMLElement).closest('.modal__close-icon')) {
            document.querySelector('.overlay')?.remove();
        }
    }
}
