/* eslint-disable max-lines-per-function */
import CartAPI from '../api/cartAPI';
import { Action, ActionType, CartItem, ProductID, Promocode, StoreEventType } from '../types';
import { Store } from './abstract/store';
import { AppStore, PROMO_CODES_INFO } from '../store/app-store';
import { Router } from '../router';
import { LoginStore } from './login-store';
import { DiscountCodeInfo } from '@commercetools/platform-sdk';

export class CartStore extends Store {
    private cartItemAmount: number;
    private items: CartItem[];
    private cartId: string;
    private version: number;
    private cartAPI: CartAPI;
    private totalPrice: number;
    private appStore: AppStore;
    private router?: Router;
    private loginStore: LoginStore;
    private promoID?: string;
    private promoCode?: string;

    constructor() {
        super();
        this.router = new Router();
        this.appStore = new AppStore(this.router);
        this.loginStore = new LoginStore(this.appStore);

        this.cartId = '';
        this.version = 1;
        this.cartItemAmount = 0;
        this.items = [];
        this.totalPrice = 0;
        this.cartAPI = new CartAPI(!localStorage.getItem('token'));
        this.loginStore.addChangeListener(StoreEventType.LOGIN, this.updateCart.bind(this));
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
            this.items.push({
                productID: el.productId,
                count: el.quantity,
                cartItemId: el.id,
                price: el.price.discounted?.value.centAmount || el.price.value.centAmount,
            });
        });
        this.totalPrice = data.body.totalPrice.centAmount;
        this.setDiscount(data.body.discountCodes);
    }

    private setDiscount(discounts: DiscountCodeInfo[]): void {
        if (discounts.length > 0) {
            const discount =
                discounts.find((item) => item.state === 'MatchesCart') || discounts.find((item) => !item.state);

            this.promoID = discount?.discountCode.id;
            if (this.promoID) {
                const promo = PROMO_CODES_INFO.find((item) => item.id === this.promoID);
                if (promo) {
                    this.promoCode = promo.code;
                }
            }
        }
    }

    public getPromoCode(): string | undefined {
        return this.promoCode;
    }

    public getSubtotalPrice(): number {
        return this.items.reduce((sum, item) => (sum += item.price), 0);
    }

    public updateCart(): void {
        this.cartId = localStorage.getItem('cartAnonID') as string;

        this.getCart()
            .then((data) => {
                data.body.lineItems.forEach((el) => {
                    this.items.push({
                        productID: el.productId,
                        count: el.quantity,
                        cartItemId: el.id,
                        price: el.price.discounted?.value.centAmount || el.price.value.centAmount,
                    });
                });
            })
            .then(() => {
                this.getCart().then((data) => {
                    this.cartItemAmount = data.body.lineItems.length;
                    this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
                });
            });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getCart() {
        return this.cartAPI.getActiveCart(this.cartId);
    }

    public getCartId(): void {
        if (localStorage.getItem('cartID') !== null) {
            this.cartId = localStorage.getItem('cartID') as string;
        } else this.cartId = localStorage.getItem('cartAnonID') as string;
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

    public hasPromo(): boolean {
        if (this.promoID) {
            return true;
        }
        return false;
    }

    private onIncItem(productID: ProductID): void {
        const product = this.items.find((item) => item.productID === productID);

        if (product && typeof product.count === 'number') {
            this.cartAPI
                .updateActiveCart({
                    cartId: this.cartId,
                    cartUpdateItemInfo: {
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
                .catch(() => {
                    this.emit(StoreEventType.CART_INC_ITEM);
                });
        } else {
            this.cartAPI
                .updateActiveCart({
                    cartId: this.cartId,
                    cartUpdateItemInfo: {
                        version: this.version,
                        productId: productID,
                        quantity: 1,
                    },
                })
                .then((data) => {
                    const item: CartItem = { productID, count: 1, cartItemId: '', price: 0 };
                    const dataItem = data.body.lineItems[data.body.lineItems.length - 1];
                    item.cartItemId = dataItem.id;
                    item.price = dataItem.price.discounted?.value.centAmount || dataItem.price.value.centAmount;
                    this.items.push(item);
                    this.cartItemAmount++;
                    this.version = data.body.version;
                    this.totalPrice = data.body.totalPrice.centAmount;
                    this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
                    this.emit(StoreEventType.CART_INC_ITEM);
                })
                .catch(() => {
                    this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
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
            this.cartAPI
                .removeLineItem(this.cartId, {
                    version: this.version,
                    lineItemId: product.cartItemId,
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
                    lineItemId: product.cartItemId,
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
        this.getCart()
            .then(async (data) => {
                this.version = data.body.version;

                for (let i = 0; i < data.body.lineItems.length; i++) {
                    await this.cartAPI
                        .removeLineItem(this.cartId, {
                            version: this.version,
                            lineItemId: data.body.lineItems[i].id,
                        })
                        .then((data) => {
                            this.version = data.body.version;
                        });
                }
            })
            .then(() => {
                this.cartItemAmount = 0;
                this.items = [];
                this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
                this.emit(StoreEventType.CART_CLEAR);
            });
    }

    private onAddPromo(promocode: Promocode): void {
        if (!PROMO_CODES_INFO.find((item) => item.code === promocode)) {
            this.emit(StoreEventType.CART_PROMO_ERROR);
        } else {
            this.cartAPI
                .addPromocode(this.cartId, {
                    version: this.version,
                    code: promocode,
                })
                .then((data) => {
                    console.log(data.body);
                    this.setDiscount(data.body.discountCodes);
                    this.version = data.body.version;
                    this.totalPrice = data.body.totalPrice.centAmount;
                    this.emit(StoreEventType.CART_PROMO_SUCCESS);
                })
                .catch(() => {
                    this.emit(StoreEventType.CART_PROMO_ERROR);
                });
        }
    }

    private onRemovePromo(): void {
        this.cartAPI
            .removePromocode(this.cartId, {
                version: this.version,
                id: this.promoID as string,
            })
            .then((data) => {
                this.promoID = undefined;
                this.promoCode = undefined;
                this.version = data.body.version;
                this.totalPrice = data.body.totalPrice.centAmount;
                this.emit(StoreEventType.CART_PROMO_SUCCESS);
            });
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

            case ActionType.CART_ADD_PROMO:
                this.onAddPromo(action.data);
                break;
            case ActionType.CART_REMOVE_PROMO:
                this.onRemovePromo();
                break;
        }
    }
}
