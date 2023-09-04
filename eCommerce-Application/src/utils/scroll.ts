export class Scroll {
    public removeScroll(): void {
        window.scrollTo(0, 0);
        (document.querySelector('body') as HTMLElement).style.overflow = 'hidden';
    }

    public addScroll(): void {
        (document.querySelector('body') as HTMLElement).style.overflow = 'scroll';
    }
}
