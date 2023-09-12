import { ActionType, ProductID } from '../../types';
import { AbstractAction } from '../abstract/action';

export class CartActions extends AbstractAction {
    public incProduct(data: ProductID): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_INC_ITEM, data });
    }

    public decProduct(data: ProductID): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_DEC_ITEM, data });
    }

    public removeProduct(data: ProductID): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_REMOVE_ITEM, data });
    }

    public clearCart(): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_CLEAR, data: '' });
    }
}
