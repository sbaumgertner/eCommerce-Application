import { Action, ActionType, CartItem, ProductKey, StoreEventType } from '../types';
import { Store } from './abstract/store';

export class CartStore extends Store {
    private cartItemAmount: number;
    private items: CartItem[];

    constructor() {
        super();
        // получить по API текущую корзину и заполнить cartItemAmount и items
        this.cartItemAmount = 0;
        this.items = [];
    }

    public getCartItemAmount(): number {
        return this.cartItemAmount;
    }

    public getCartItems(): CartItem[] {
        return this.items;
    }

    private onAddItem(productKey: ProductKey): void {
        const product = this.items.find((item) => item.key === productKey);

        if (product) {
            product.count++;
            // ДОБАВИТЬ API изменения количества продукта в корзине
        } else {
            this.cartItemAmount++;
            this.items.push({ key: productKey, count: 1 });
            // ДОБАВИТЬ API добавки продукта в корзину
            this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
        }

        this.emit(StoreEventType.CART_ADD_ITEM);
    }

    private onRemoveItem(productKey: ProductKey): void {
        let index = 0;
        const product = this.items.find((item, i) => {
            if (item.key === productKey) {
                index = i;
                return true;
            }
            return false;
        });

        if (product && product.count > 1) {
            product.count--;
            // ДОБАВИТЬ API изменения количества продукта в корзине
        } else {
            this.cartItemAmount--;
            this.items.splice(index, 1);
            // ДОБАВИТЬ API удаления продукта из корзину
            if (this.items.length === 0) {
                this.emit(StoreEventType.CART_CLEAR);
            }
            this.emit(StoreEventType.CART_ITEM_AMOUNT_CHANGE);
        }

        this.emit(StoreEventType.CART_ADD_ITEM);
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
            case ActionType.CART_ADD_ITEM:
                this.onAddItem(action.data);
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
