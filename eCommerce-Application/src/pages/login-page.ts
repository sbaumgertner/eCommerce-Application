import { Page } from './abstract/page';

export class LoginPage extends Page {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = 'Login Page';
    }
}
