import './cart-item-counter.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { Button } from '../button/button';
import { CartInteractionProps } from '../../types';
import { CartStore } from '../../store/cart-store';
import { CartActions } from '../../store/action/cartActions';

export class CartItemCounter extends Component {
    private cartActions: CartActions;
    private count = 0;
    private incBtnEl: HTMLElement;
    private decBtnEl: HTMLElement;
    private displayEl: HTMLElement;

    constructor(private props: CartInteractionProps, private cartStore: CartStore) {
        super({ tag: 'div', classes: ['cic-bar'] });
        this.cartActions = new CartActions();
        this.incBtnEl = this.createIncBtn();
        this.decBtnEl = this.createDecBtn();
        this.displayEl = this.createCountDisplay();
        this.render();
    }

    public render(): void {
        this.setCountDisplay();
        this.componentElem.append(this.decBtnEl, this.displayEl, this.incBtnEl);

        this.componentElem.addEventListener('click', (e: Event) => {
            e.preventDefault();
        });
    }

    private createIncBtn(): HTMLElement {
        const incrementBtnEl = new Button(this.props.type, undefined, '+').getComponent();

        incrementBtnEl.classList.add('cic-bar__inc');
        incrementBtnEl.addEventListener('click', () => {
            this.cartActions.incProduct(this.props.productID);
            this.setCountDisplay();
        });

        return incrementBtnEl;
    }

    private createDecBtn(): HTMLElement {
        const decrementBtnEl = new Button('bordered', undefined, '-').getComponent();

        decrementBtnEl.classList.add('cic-bar__dec');
        decrementBtnEl.addEventListener('click', () => {
            if (this.count > 1) {
                this.cartActions.decProduct(this.props.productID);
            } else {
                this.cartActions.removeProduct(this.props.productID);
            }
            this.setCountDisplay();
        });

        return decrementBtnEl;
    }

    private createCountDisplay(): HTMLElement {
        const displayEl = createElement({ tag: 'div', classes: ['cic-bar__display'], text: `${this.count}` });
        return displayEl;
    }

    private setCountDisplay(): void {
        this.count = this.cartStore.getCartItems().find((item) => item.productID === this.props.productID)?.count || 0;
        this.displayEl.innerText = `${this.count}`;
    }
}
