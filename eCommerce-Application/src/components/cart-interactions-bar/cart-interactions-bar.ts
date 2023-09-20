import './cart-interactions-bar.scss';

import Component from '../abstract/component';
import { Button } from '../button/button';
import { CartInteractionProps, StoreEventType } from '../../types';
import { CartStore } from '../../store/cart-store';
import { CartActions } from '../../store/action/cartActions';
import { CartItemCounter } from '../cart-item-counter/cart-item-counter';
import { Loader } from '../loader/loader';

export class CartInteractionBar extends Component {
    private cartActions = new CartActions();
    private count = 0;
    private addBtnEl = this.createAddBtn();
    private removeBtnEl = this.createRemoveBtn();
    private buttonBar: CartItemCounter;
    private loaderEl = new Loader().getComponent();

    constructor(private props: CartInteractionProps, private cartStore: CartStore) {
        super({ tag: 'div', classes: ['cib-bar'] });
        this.cartStore.addChangeListener(StoreEventType.CART_ITEM_AMOUNT_CHANGE, this.render.bind(this));
        this.buttonBar = new CartItemCounter(props, cartStore);
        this.render();
    }

    public render(): void {
        const cartItem = this.cartStore.getCartItems().find((item) => item.productID === this.props.productID);
        this.count = cartItem ? cartItem.count : 0;
        this.componentElem.innerHTML = '';

        if (this.count === 0) {
            this.componentElem.append(this.addBtnEl);
        } else {
            this.buttonBar.render();
            this.componentElem.append(this.buttonBar.getComponent(), this.removeBtnEl);
        }
    }

    private createAddBtn(): HTMLElement {
        const addToCardBtnEl = new Button(this.props.type, undefined, 'Add to cart').getComponent();

        addToCardBtnEl.classList.add('cib-bar__add');
        addToCardBtnEl.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this.setLoaderMod();
            this.cartActions.incProduct(this.props.productID);
        });

        return addToCardBtnEl;
    }

    private createRemoveBtn(): HTMLElement {
        const removeFromCardBtnEl = new Button('bordered', undefined, 'Remove from cart').getComponent();

        removeFromCardBtnEl.classList.add('button_bordered_negative', 'cib-bar__remove');
        removeFromCardBtnEl.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this.setLoaderMod();
            this.cartActions.removeProduct(this.props.productID);
        });

        return removeFromCardBtnEl;
    }

    private setLoaderMod(): void {
        this.componentElem.innerHTML = '';
        this.componentElem.append(this.loaderEl);
    }
}
