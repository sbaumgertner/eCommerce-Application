import { AppStore } from '../../store/app-store';
import { Page } from '../abstract/page';

export class ProductPage extends Page {
    private appStore: AppStore;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'product-page';

        const resource: string = this.appStore.getCurrentPageResource();

        this.html.textContent = 'Product ' + resource;
    }
}
