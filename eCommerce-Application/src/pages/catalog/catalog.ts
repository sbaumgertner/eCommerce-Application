import { RouteAction } from '../../store/action/routeAction';
import { PageName } from '../../types';
import createElement from '../../utils/create-element';
import { Page } from '../abstract/page';

export class CatalogPage extends Page {
    private routeAction: RouteAction;

    constructor() {
        super();
        this.routeAction = new RouteAction();
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'account-page';
        this.html.append(this.createProduct('1'), this.createProduct('2'));
    }

    private createProduct(id: string): HTMLElement {
        const product = createElement({ tag: 'div', classes: ['product'] });
        product.dataset.id = id;
        product.textContent = 'product ' + id;
        product.addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.PRODUCT, resource: id });
        });
        return product;
    }
}
