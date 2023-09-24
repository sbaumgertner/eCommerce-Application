import './cart-item.scss';
import { ProductStore } from '../../store/product-store';
import { ProductData, StoreEventType } from '../../types';
import Component from '../abstract/component';
import { CartItemCounter } from '../cart-item-counter/cart-item-counter';
import { CartStore } from '../../store/cart-store';
import createElement from '../../utils/create-element';
import { IconButton } from '../button/button';

import deleteIcon from '../../assets/icons/icon-delete.svg';
import { CartActions } from '../../store/action/cartActions';

export default class CartItem extends Component {
    private productId: string;
    private cartStore: CartStore;
    private productData?: ProductData;
    private count: number;
    private currentPrice = 0;
    private cartActions: CartActions;

    constructor(productId: string, count: number, cartStore: CartStore) {
        super({ tag: 'div', classes: ['cart-item'] });
        this.productId = productId;
        this.cartStore = cartStore;
        this.count = count;
        this.cartActions = new CartActions();
        this.cartStore.addChangeListener(StoreEventType.CART_INC_ITEM, () => this.updateCount());
        this.cartStore.addChangeListener(StoreEventType.CART_DEC_ITEM, () => this.updateCount());
    }

    public updateCount(): void {
        const items = this.cartStore.getCartItems();
        const data = items.find((item) => item.productID === this.productId);
        const count = data?.count || 0;
        if (this.count !== count) {
            this.count = count;
            (this.getComponent().querySelector('.cic-bar__display') as HTMLElement).textContent = this.count + '';
            const totalEl: HTMLElement = this.getComponent().querySelector('.cart-item__total') as HTMLElement;
            totalEl.innerHTML = `<p>${(this.currentPrice * this.count) / 100}$</p>`;
        }
    }

    public remove(): void {
        this.getComponent().remove();
    }

    public async render(): Promise<void> {
        const productStore = new ProductStore();
        await productStore.setDataFromAPIById(this.productId);
        this.productData = productStore.getProduct();

        this.currentPrice = this.productData.discountPrice || this.productData.price;

        this.componentElem.innerHTML = `
        <div class="cart-item__img-wrap">
          <img class="cart-item__img" alt="image" src="${this.productData.images[0]}">
        </div>
        <div class="cart-item__text">
          <p class="cart-item__attrs">
            <span>${this.productData.category}</span>
            <span>|</span>
            <span>${this.productData.age}</span>
          </p>
          <p class="cart-item__name">${this.productData.name}</p>
        </div>
        <div class="cart-item__prices">
          <p class="cart-item__discounted">${
              this.productData.discountPrice ? '$' + this.productData.price / 100 : ''
          }</p>
          <p class="cart-item__price">$${this.currentPrice / 100}</p>
        </div>
        `;
        const counter = new CartItemCounter({ type: 'bordered', productID: this.productId }, this.cartStore);
        this.componentElem.append(counter.getComponent());
        const totalEl = createElement({ tag: 'div', classes: ['cart-item__total'] });
        totalEl.innerHTML = `<p>$${(this.currentPrice * this.count) / 100}</p>`;
        this.componentElem.append(totalEl);

        const deleteBtn = new IconButton({ icon: deleteIcon, type: 'clear', id: 'delete-item' });
        deleteBtn.getComponent().classList.add('cart-item__delete');
        this.componentElem.append(deleteBtn.getComponent());

        deleteBtn.getComponent().addEventListener('click', () => {
            this.cartActions.removeProduct(this.productId);
        });
    }
}
