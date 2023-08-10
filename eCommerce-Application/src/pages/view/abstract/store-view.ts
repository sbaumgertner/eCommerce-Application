import { Store } from '../../../store/abstract/store';
import { View } from './view';

export abstract class StoreView extends View {
    protected store: Store;

    constructor(store: Store) {
        super();
        this.store = store;
    }

    protected abstract onStoreChange(): void;
}
