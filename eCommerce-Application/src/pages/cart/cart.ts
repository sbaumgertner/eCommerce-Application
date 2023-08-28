import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';

export class CartPage extends Page {
    private appStore: AppStore;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'cart-page';

        const resource: string = this.appStore.getCurrentPageResource();

        this.html.textContent = 'Cart ' + resource;
    }
}
