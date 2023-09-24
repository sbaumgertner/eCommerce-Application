export function addRemoveClasslist(el1: HTMLElement, el2: HTMLElement): void {
    el1.classList.remove('button_clear');
    el1.classList.add('button_filled');
    el2.classList.add('default');
}
