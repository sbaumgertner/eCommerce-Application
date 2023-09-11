import { Page } from '../abstract/page';

export class AboutPage extends Page {
    public render(): void {
        this.html = document.createElement('div');
        this.html.innerHTML = `
            About page
        `;
    }
}
