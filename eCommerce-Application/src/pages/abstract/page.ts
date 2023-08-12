export abstract class Page {
    protected html?: HTMLElement;

    public getHtml(): HTMLElement {
        return this.html as HTMLElement;
    }

    public abstract render(): void;
}
