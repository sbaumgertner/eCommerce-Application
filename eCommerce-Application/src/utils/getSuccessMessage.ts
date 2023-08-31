export function getSuccessMessage(message: string): void {
    (document.querySelector('.popup__content') as HTMLElement).innerHTML = '';
    (document.querySelector('.popup__content') as HTMLElement).innerHTML = message;
    (document.querySelector('.popup__content') as HTMLElement).style.color = '#003300';
    setTimeout(() => {
        document.querySelector('.dimming-window')?.remove();
    }, 2000);
}
