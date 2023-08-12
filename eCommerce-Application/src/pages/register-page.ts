import { Page } from './abstract/page';

export class RegisterPage extends Page {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = 'Register Page';
    }
}
