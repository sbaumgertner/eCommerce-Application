/* eslint-disable max-lines-per-function */
import CartAPI from '../api/cartAPI';
import { Action, ActionType, CartItem, ProductID, StoreEventType } from '../types';
import { Store } from './abstract/store';

export class CartStore extends Store {
    private cartItemAmount: number;
    private items: CartItem[];
    private cartId: string;
    private version: number;
    private cartAPI: CartAPI;
    private totalPrice: number;

    constructor() {
        super();
        this.cartId = '';
        this.version = 1;
        this.cartItemAmount = 0;
        this.items = [];
        this.totalPrice = 0;
        this.cartAPI = new CartAPI(!localStorage.getItem('token'));
        this.setMaxListeners(100);
    }

    public async initCart(): Promise<void> {
        if (localStorage.getItem('cartAnonID') !== null) {
            this.cartId = localStorage.getItem('cartAnonID') as string;
        } else {
            await this.cartAPI.createCartForAnonymousCustomer({ currency: 'USD' });
            this.cartId = localStorage.getItem('cartAnonID') as string;
        }
        const data = await this.cartAPI.getActiveCart(this.cartId);
        this.version = data.body.version;
        this.cartItemAmount = data.body.lineItems.length;
        data.body.lineItems.forEach((el) => {
            this.items.push({ productID: el.productId, count: el.quantity, cartItemId: el.id });
        });
        this.totalPrice = data.body.totalPrice.centAmount;
    }

    public getCartItemAmount(): number {
        return this.cartItemAmount;
    }

    public getCartItems(): CartItem[] {
        return this.items;
    }

    public getTotalPrice(): number {
        return this.totalPrice;
    }

    private onIncItem(productID: ProductID): void {
        const product = this.items.find((item) => item.productID === productID);

        if (product && typeof product.count === 'number') {
            this.cartAPI
                .updateActiveCart({
                    cartId: this.cartId,
                    cartUpdateDraft: {
                        version: this.version,
                        productId: productID,
                        quantity: 1,
                    },
                })
                .then((data) => {
                    product.count = Number(product.count) + 1;
                    this.version = data.body.version;
                    this.totalPrice = data.body.totalPrice.centAmount;
                    this.emit(StoreEventType.CART_INC_ITEM);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            this.cartAPI
                .updateActiveCart({
                    cartId: this.cartId,
                    cartUpdateDraft: {
                        version: this.version,
                        productId: productID,
                        quantity: 1,
                    },
                })
                .then((data) => {
                    const item: CartItem = { productID, count: 1 };
                    item.cartItemId = data.body.lineItems[data.body.lineItems.length - 1].id;
                    this.items.push(item);
                    this.cartItemAmount++;
                    this.version = data.body.version;
                    this.totalPrice = data.body.totalPrice.centAmount;
                    this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
                    this.emit(StoreEventType.CART_INC_ITEM);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    // eslint-disable-next-line max-lines-per-function
    private onDecItem(productID: ProductID): void {
        let index = 0;
        const product = this.items.find((item, i) => {
            if (item.productID === productID) {
                index = i;
                return true;
            }
            return false;
        });

        if (product && typeof product.count === 'number' && product.count > 1) {
            this.cartAPI
                .removeLineItem(this.cartId, {
                    version: this.version,
                    lineItemId: product.cartItemId as string,
                    quantity: 1,
                })
                .then((data) => {
                    product.count = Number(product.count) - 1;
                    this.version = data.body.version;
                    this.totalPrice = data.body.totalPrice.centAmount;
                    this.emit(StoreEventType.CART_DEC_ITEM);
                });
        } else {
            this.cartAPI
                .removeLineItem(this.cartId, {
                    version: this.version,
                    lineItemId: product?.cartItemId as string,
                })
                .then((data) => {
                    this.cartItemAmount--;
                    this.items.splice(index, 1);
                    this.version = data.body.version;
                    this.totalPrice = data.body.totalPrice.centAmount;
                    if (this.items.length === 0) {
                        this.emit(StoreEventType.CART_CLEAR);
                    }
                    this.emit(StoreEventType.CART_REMOVE_ITEM);
                    this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
                });
        }
    }

    private onRemoveItem(productID: ProductID): void {
        let index = 0;
        const product = this.items.find((item, i) => {
            if (item.productID === productID) {
                index = i;
                return true;
            }
            return false;
        });

        if (product) {
            this.cartAPI
                .removeLineItem(this.cartId, {
                    version: this.version,
                    lineItemId: product.cartItemId as string,
                })
                .then((data) => {
                    this.cartItemAmount--;
                    this.items.splice(index, 1);
                    this.version = data.body.version;
                    this.totalPrice = data.body.totalPrice.centAmount;
                    if (this.items.length === 0) {
                        this.emit(StoreEventType.CART_CLEAR);
                    }
                    this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
                    this.emit(StoreEventType.CART_REMOVE_ITEM);
                });
        }
    }

    private onClearCart(): void {
        this.cartItemAmount = 0;
        this.items = [];
        // ДОБАВИТЬ API очистки корзины

        this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
        this.emit(StoreEventType.CART_CLEAR);
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.CART_INC_ITEM:
                this.onIncItem(action.data);
                break;
            case ActionType.CART_DEC_ITEM:
                this.onDecItem(action.data);
                break;
            case ActionType.CART_REMOVE_ITEM:
                this.onRemoveItem(action.data);
                break;
            case ActionType.CART_CLEAR:
                this.onClearCart();
                break;
        }
    }
}
