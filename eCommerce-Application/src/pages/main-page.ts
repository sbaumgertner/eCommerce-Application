import { Page } from './abstract/page';

export class MainPage extends Page {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = 'Main Page';
    }
}
