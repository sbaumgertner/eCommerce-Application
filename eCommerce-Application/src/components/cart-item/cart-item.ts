import './cart-item.scss';
import { ProductStore } from '../../store/product-store';
import { ProductData } from '../../types';
import Component from '../abstract/component';
import { CartItemCounter } from '../cart-item-counter/cart-item-counter';
import { CartStore } from '../../store/cart-store';
import createElement from '../../utils/create-element';
import { IconButton } from '../button/button';

import deleteIcon from '../../assets/icons/icon-delete.svg';

export default class CartItem extends Component {
    private productId: string;
    private cartStore: CartStore;
    private productData?: ProductData;
    private count: number;

    constructor(productId: string, count: number, cartStore: CartStore) {
        super({ tag: 'div', classes: ['cart-item'] });
        this.productId = productId;
        this.cartStore = cartStore;
        this.count = count;
    }

    public async render(): Promise<void> {
        const productStore = new ProductStore();
        await productStore.setDataFromAPIById(this.productId);
        this.productData = productStore.getProduct();

        const currentPrice = this.productData.discountPrice || this.productData.price;

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
          <p class="cart-item__discounted">${this.productData.discountPrice ? this.productData.price + '$' : ''}</p>
          <p class="cart-item__price">${currentPrice}$</p>
        </div>
        `;
        const counter = new CartItemCounter({ type: 'bordered', productID: this.productId }, this.cartStore);
        this.componentElem.append(counter.getComponent());
        const totalEl = createElement({ tag: 'div', classes: ['cart-item__total'] });
        totalEl.innerHTML = `<p>${currentPrice * this.count}$</p>`;
        this.componentElem.append(totalEl);

        const deleteBtn = new IconButton({ icon: deleteIcon, type: 'clear', id: 'delete-item' });
        deleteBtn.getComponent().classList.add('cart-item__delete');
        this.componentElem.append(deleteBtn.getComponent());
    }
}
