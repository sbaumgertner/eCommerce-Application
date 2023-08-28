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
        this.html.append(this.createCart('1'), this.createCart('2'));
    }

    private createCart(id: string): HTMLElement {
        const cart = createElement({ tag: 'div', classes: ['cart'] });
        cart.dataset.id = id;
        cart.textContent = 'cart ' + id;
        cart.addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.CART, resource: id });
        });
        return cart;
    }
}
