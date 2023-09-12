import './cart-interactions-bar.scss';

import Component from '../abstract/component';
import { Button } from '../button/button';
import { CartInteractionProps, StoreEventType } from '../../types';
import { CartStore } from '../../store/cart-store';
import { CartActions } from '../../store/action/cartActions';
import { CartItemCounter } from '../cart-item-counter/cart-item-counter';

export class CartInteractionBar extends Component {
    private cartActions: CartActions;
    private count = 0;
    private addBtnEl: HTMLElement;
    private removeBtnEl: HTMLElement;
    private buttonBar: CartItemCounter;

    constructor(private props: CartInteractionProps, private cartStore: CartStore) {
        super({ tag: 'div', classes: ['cib-bar'] });
        this.cartStore.addChangeListener(StoreEventType.CART_REMOVE_ITEM, this.render.bind(this));
        this.cartActions = new CartActions();
        this.addBtnEl = this.createAddBtn();
        this.removeBtnEl = this.createRemoveBtn();
        this.buttonBar = new CartItemCounter(props, cartStore);
        this.render();
    }

    public render(): void {
        this.count = this.cartStore.getCartItems().find((item) => item.productID === this.props.productID)?.count || 0;
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
            this.cartActions.incProduct(this.props.productID);
            this.render();
        });

        return addToCardBtnEl;
    }

    private createRemoveBtn(): HTMLElement {
        const removeFromCardBtnEl = new Button('bordered', undefined, 'Remove from cart').getComponent();

        removeFromCardBtnEl.classList.add('button_bordered_negative', 'cib-bar__remove');
        removeFromCardBtnEl.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this.cartActions.removeProduct(this.props.productID);
        });

        return removeFromCardBtnEl;
    }
}
