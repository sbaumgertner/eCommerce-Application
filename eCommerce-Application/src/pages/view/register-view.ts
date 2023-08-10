import { View } from './abstract/view';

export class RegisterView extends View {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = 'Register Page';
    }
}
