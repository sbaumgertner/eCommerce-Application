import './cart.scss';
import { AppStore } from '../../store/app-store';
import createElement from '../../utils/create-element';
import { Page } from '../abstract/page';
import { CartActions } from '../../store/action/cartActions';
import { Button } from '../../components/button/button';
import { CartStore } from '../../store/cart-store';
import CartItem from '../../components/cart-item/cart-item';
import { RouteAction } from '../../store/action/routeAction';
import { PageName, StoreEventType } from '../../types';

const EMPTY_CART_TITLE = `Your home is missing something... a little green!`;
const EMPTY_CART_MESSAGE = `Take a look at our curated plant collections to find the perfect addition to your space.`;

export class CartPage extends Page {
    private cartAction = new CartActions();
    private routeAction = new RouteAction();

    constructor(private appStore: AppStore, private cartStore: CartStore) {
        super();
        this.cartStore.addChangeListener(StoreEventType.CART_ITEM_AMOUNT_CHANGE, this.render.bind(this));
    }

    public render(): void {
        if (this.html) {
            this.html.innerHTML = '';
        } else {
            this.html = document.createElement('div');
        }
        this.html.append(this.createCartSection());
    }

    private createCartSection(): HTMLElement {
        const sectionEl = createElement({ tag: 'section', classes: ['cart'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'cart__wrapper'] });
        const myCartEl = this.createMyCart();
        const summaryEl = this.createSummary();

        if (this.cartStore.getCartItemAmount() === 0) {
            wrapperEl.append(myCartEl);
        } else {
            wrapperEl.append(myCartEl, summaryEl);
        }

        sectionEl.append(wrapperEl);
        return sectionEl;
    }

    private createMyCart(): HTMLElement {
        const myCartEl = createElement({ tag: 'div', classes: ['cart__my-cart'] });
        const headerEl = this.createMyCartHeader();
        const listEl = this.createMyCartList();
        const emptyEl = this.createMyCartEmpty();

        if (this.cartStore.getCartItemAmount() === 0) {
            myCartEl.classList.add('cart__my-cart_empty');
            myCartEl.append(headerEl, emptyEl);
        } else {
            myCartEl.append(headerEl, listEl);
        }
        return myCartEl;
    }

    private createMyCartHeader(): HTMLElement {
        const headerEl = createElement({ tag: 'div', classes: ['my-cart__header'] });
        const titleEl = createElement({
            tag: 'h4',
            classes: ['my-cart__title'],
            text: 'My Cart',
        });
        const btnResetCart = new Button('bordered', 'clear-cart', 'Clear cart');
        const btnResetCartEl = btnResetCart.getComponent();

        if (this.cartStore.getCartItemAmount() === 0) {
            btnResetCart.disable();
        }
        btnResetCartEl.classList.add('button_bordered_negative');
        btnResetCartEl.addEventListener('click', () => {
            this.cartAction.clearCart();
            console.log('Clear cart');
        });

        headerEl.append(titleEl, btnResetCartEl);
        return headerEl;
    }

    private createMyCartList(): HTMLElement {
        const cartListEl = createElement({
            tag: 'div',
            classes: ['my-cart__list'],
        });

        cartListEl.innerHTML = `
            <div class="my-cart__list-header">
                <p class="header-plant">Plant</p>
                <p class="header-price">Price</p>
                <p class="header-count">Quantity</p>
                <p class="header-total">Total</p>
            </div>
        `;

        const items = this.cartStore.getCartItems();
        for (let i = 0; i < items.length; i += 1) {
            const item = new CartItem(items[i].productID, items[i].count as number, this.cartStore);
            item.render();
            cartListEl.append(item.getComponent());
        }

        return cartListEl;
    }

    private createMyCartEmpty(): HTMLElement {
        const cartListEl = createElement({ tag: 'div', classes: ['empty-cart'] });
        const titleEl = createElement({ tag: 'h2', classes: ['empty-cart__title'], text: EMPTY_CART_TITLE });
        const messageEl = createElement({ tag: 'h5', classes: ['empty-cart__message'], text: EMPTY_CART_MESSAGE });
        const btnEl = new Button('filled', '', 'Go to Catalog').getComponent();

        btnEl.addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.CATALOG });
        });
        cartListEl.append(titleEl, messageEl, btnEl);
        return cartListEl;
    }

    private createSummary(): HTMLElement {
        const summaryEl = createElement({ tag: 'div', classes: ['cart__summary', 'summary'] });
        const headerEl = createElement({
            tag: 'h4',
            classes: ['summary__header'],
            text: 'Summary',
        });
        const innerEl = this.createSummaryInner();

        summaryEl.append(headerEl, innerEl);
        return summaryEl;
    }

    private createSummaryInner(): HTMLElement {
        const summaryInnerEl = createElement({
            tag: 'div',
            classes: ['summary__inner'],
            text: 'SUMMARY_INNER',
        });

        return summaryInnerEl;
    }
}
