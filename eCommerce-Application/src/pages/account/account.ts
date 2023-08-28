import { Page } from '../abstract/page';

export class AccountPage extends Page {
    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'account-page';
        this.html.textContent = 'Account Page';
    }
}
