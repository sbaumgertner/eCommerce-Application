/* eslint-disable max-lines-per-function */
import CartAPI from '../api/cartAPI';
import { Action, ActionType, CartItem, ProductID, StoreEventType } from '../types';
import { Store } from './abstract/store';
import { AppStore } from '../store/app-store';
//import cartApi from '../api/cartAPI';

export class CartStore extends Store {
    private cartItemAmount: number;
    private items: CartItem[];
    private cartId: string;
    private version: number;

    constructor(private appStore: AppStore) {
        super();

        // получить по API текущую корзину (или создать новую) и заполнить cartItemAmount и items
        this.cartId = '';
        this.version = 1;
        this.cartItemAmount = 0;
        this.items = [];
        if (localStorage.getItem('cartAnonID') !== null) {
            this.cartId = localStorage.getItem('cartAnonID') as string;
            this.getCart().then((data) => {
                this.version = data.body.version;
                this.cartItemAmount = data.body.lineItems.length;
                data.body.lineItems.forEach((el) => {
                    this.items.push({ productID: el.productId, count: el.quantity });
                });
            });
        } else {
            new CartAPI(this.appStore).createCartForAnonymousCustomer({ currency: 'USD' }).then(() => {
                this.cartId = localStorage.getItem('cartAnonID') as string;
                console.log(this.cartId);
            });
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getCart() {
        return new CartAPI(this.appStore).getActiveCart(this.cartId);
    }

    public getCartItemAmount(): number {
        return this.cartItemAmount;
    }

    public getCartItems(): CartItem[] {
        return this.items;
    }

    private onIncItem(productID: ProductID): void {
        const product = this.items.find((item) => item.productID === productID);

        if (product && typeof product.count === 'number') {
            const currentCount = product.count;
            product.count = null;
            this.emit(StoreEventType.CART_INC_ITEM);
            // ДОБАВИТЬ API изменения количества продукта в корзине (+1)
            new CartAPI(this.appStore)
                .updateActiveCart({
                    cartId: this.cartId,
                    cartUpdateDraft: {
                        version: this.version,
                        productId: productID,
                        quantity: 1,
                    },
                })
                .then((data) => {
                    product.count = currentCount + 1;
                    this.version = data.body.version;
                    this.emit(StoreEventType.CART_INC_ITEM);
                })
                .catch(() => {
                    product.count = currentCount;
                    this.emit(StoreEventType.CART_INC_ITEM);
                });
        } else {
            const item: CartItem = { productID, count: null };
            this.items.push(item);
            this.emit(StoreEventType.CART_INC_ITEM);
            // ДОБАВИТЬ API добавки продукта в корзину
            new CartAPI(this.appStore)
                .updateActiveCart({
                    cartId: this.cartId,
                    cartUpdateDraft: {
                        version: this.version,
                        productId: productID,
                        quantity: 1,
                    },
                })
                .then((data) => {
                    item.count = 1;
                    item.cartItemId = data.body.lineItems[data.body.lineItems.length - 1].id;
                    this.cartItemAmount++;
                    this.version = data.body.version;
                    this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
                    this.emit(StoreEventType.CART_INC_ITEM);
                })
                .catch(() => {
                    this.items.pop();
                    this.emit(StoreEventType.CART_INC_ITEM);
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
            product.count--;
            // ДОБАВИТЬ API изменения количества продукта в корзине (-1)
            new CartAPI(this.appStore)
                .removeLineItem(this.cartId, {
                    version: this.version,
                    lineItemId: product.cartItemId as string,
                    quantity: 1,
                })
                .then((data) => {
                    this.version = data.body.version;
                });
        } else {
            this.cartItemAmount--;
            this.items.splice(index, 1);
            // ДОБАВИТЬ API удаления продукта из корзину
            new CartAPI(this.appStore)
                .removeLineItem(this.cartId, {
                    version: this.version,
                    lineItemId: product?.cartItemId as string,
                })
                .then((data) => {
                    this.version = data.body.version;
                });

            if (this.items.length === 0) {
                this.emit(StoreEventType.CART_CLEAR);
            }
            this.emit(StoreEventType.CART_REMOVE_ITEM);
            this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
        }

        this.emit(StoreEventType.CART_DEC_ITEM);
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
            this.cartItemAmount--;
            this.items.splice(index, 1);
            // ДОБАВИТЬ API удаления продукта из корзину
            new CartAPI(this.appStore)
                .removeLineItem(this.cartId, {
                    version: this.version,
                    lineItemId: product.cartItemId as string,
                })
                .then((data) => {
                    this.version = data.body.version;
                });
            if (this.items.length === 0) {
                this.emit(StoreEventType.CART_CLEAR);
            }
            this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
        }

        this.emit(StoreEventType.CART_REMOVE_ITEM);
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
