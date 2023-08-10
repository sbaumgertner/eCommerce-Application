import { View } from './abstract/view';

export class IndexView extends View {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = 'Main Page';
    }
}
