import { ActionType, ProductKey } from '../../types';
import { AbstractAction } from '../abstract/action';

export class CartActions extends AbstractAction {
    public addProduct(data: ProductKey): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_ADD_ITEM, data });
    }

    public removeProduct(data: ProductKey): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_REMOVE_ITEM, data });
    }

    public clearCart(): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_CLEAR, data: '' });
    }
}
