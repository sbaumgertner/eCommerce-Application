import { Page } from './abstract/page';

export class NotFoundPage extends Page {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = 'Page not found';
    }
}
