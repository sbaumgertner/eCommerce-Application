import { ActionType, ProductID, Promocode } from '../../types';
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

    public addPromo(data: Promocode): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_ADD_PROMO, data });
    }

    public removePromo(data: Promocode): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_REMOVE_PROMO, data });
    }

    public clearCart(): void {
        this.dispatcher.handleAction({ actionType: ActionType.CART_CLEAR, data: '' });
    }
}
