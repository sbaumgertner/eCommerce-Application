import './icon-with-counter.scss';
import { IconButton } from '../button/button';

export default class IconWithCounter extends IconButton {
    constructor(private icon: string, type: 'filled' | 'bordered' | 'clear', private count: number) {
        const iconCountParams = {
            icon,
            type,
        };
        super(iconCountParams);
        this.render();
    }

    public setCount(count: number): void {
        this.count = count;
        this.componentElem.dataset.count = `${count}`;
        if (count > 0) {
            this.componentElem.classList.add('icon-count_count');
        } else {
            this.componentElem.classList.remove('icon-count_count');
        }
    }

    public render(): void {
        this.componentElem.classList.add('icon-count');
        this.setCount(this.count);
    }
}
