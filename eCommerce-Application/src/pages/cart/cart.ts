import { Page } from '../abstract/page';

export class CartPage extends Page {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = `
            Cart page
        `;
    }
}
