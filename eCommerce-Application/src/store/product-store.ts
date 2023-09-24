import { ProductsApi } from '../api/productsAPI';
import { Action, ActionType, ProductData } from '../types';
import { Store } from './abstract/store';

export class ProductStore extends Store {
    private product?: ProductData;

    public async setDataFromAPI(productKey: string): Promise<void> {
        const api = new ProductsApi();
        this.product = await api.getProductByKey(productKey);
    }

    public async setDataFromAPIById(productId: string): Promise<void> {
        const api = new ProductsApi();
        this.product = await api.getProductById(productId);
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.LOGIN:
                break;
        }
    }

    public getProduct(): ProductData {
        return this.product as ProductData;
    }
}
