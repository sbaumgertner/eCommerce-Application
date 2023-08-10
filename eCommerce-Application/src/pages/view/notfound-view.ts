import { View } from './abstract/view';

export class NotFoundView extends View {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = 'Page not found';
    }
}
