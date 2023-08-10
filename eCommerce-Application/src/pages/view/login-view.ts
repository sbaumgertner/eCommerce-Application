import { View } from './abstract/view';

export class LoginView extends View {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = 'Login Page';
    }
}
