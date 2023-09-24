import './cart-item-counter.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { Button } from '../button/button';
import { CartInteractionProps, StoreEventType } from '../../types';
import { CartStore } from '../../store/cart-store';
import { CartActions } from '../../store/action/cartActions';
import { Loader } from '../loader/loader';

export class CartItemCounter extends Component {
    private cartActions = new CartActions();
    private count = 0;
    private incBtnEl = this.createIncBtn();
    private decBtnEl = this.createDecBtn();
    private displayEl = this.createCountDisplay();
    private loaderEl = new Loader().getComponent();

    constructor(private props: CartInteractionProps, private cartStore: CartStore) {
        super({ tag: 'div', classes: ['cic-bar'] });
        this.cartStore.addChangeListener(StoreEventType.CART_INC_ITEM, this.setCountDisplay.bind(this));
        this.cartStore.addChangeListener(StoreEventType.CART_DEC_ITEM, this.setCountDisplay.bind(this));
        this.render();
    }

    public render(): void {
        this.setCountDisplay();
        this.componentElem.append(this.decBtnEl, this.displayEl, this.incBtnEl);
        this.componentElem.addEventListener('click', (e: Event) => {
            e.preventDefault();
        });
    }

    private createIncBtn(): HTMLButtonElement {
        const incrementBtnEl = new Button(this.props.type, undefined, '+').getComponent();

        incrementBtnEl.classList.add('cic-bar__inc');
        incrementBtnEl.addEventListener('click', () => {
            this.setLoaderMod();
            this.cartActions.incProduct(this.props.productID);
        });

        return incrementBtnEl;
    }

    private createDecBtn(): HTMLButtonElement {
        const decrementBtnEl = new Button('bordered', undefined, '-').getComponent();

        decrementBtnEl.classList.add('cic-bar__dec');
        decrementBtnEl.addEventListener('click', () => {
            this.setLoaderMod();
            if (this.count > 1) {
                this.cartActions.decProduct(this.props.productID);
            } else {
                this.cartActions.removeProduct(this.props.productID);
            }
        });

        return decrementBtnEl;
    }

    private createCountDisplay(): HTMLElement {
        const displayEl = createElement({ tag: 'div', classes: ['cic-bar__display'], text: `${this.count}` });
        return displayEl;
    }

    private setLoaderMod(): void {
        this.decBtnEl.disabled = true;
        this.incBtnEl.disabled = true;
        this.displayEl.innerHTML = '';
        this.displayEl.append(this.loaderEl);
    }

    private setCountDisplay(): void {
        this.decBtnEl.disabled = false;
        this.incBtnEl.disabled = false;
        this.count = this.cartStore.getCartItems().find((item) => item.productID === this.props.productID)?.count || 0;
        this.displayEl.innerHTML = `${this.count}`;
    }
}
