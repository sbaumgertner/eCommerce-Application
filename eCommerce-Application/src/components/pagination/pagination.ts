import './pagination.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { IconButton } from '../button/button';

import arrowDbLeftIcon from '../../assets/icons/icon-arrow-db-left.svg';
import arrowLeftIcon from '../../assets/icons/icon-arrow-left.svg';
import arrowRightIcon from '../../assets/icons/icon-arrow-right.svg';
import arrowDbRightIcon from '../../assets/icons/icon-arrow-db-right.svg';

export class Pagination extends Component {
    private firstPageBtn = new IconButton({
        icon: arrowDbLeftIcon,
        type: 'bordered',
    }).getComponent();
    private prevPageBtn = new IconButton({
        icon: arrowLeftIcon,
        type: 'bordered',
    }).getComponent();
    private nextPageBtn = new IconButton({
        icon: arrowRightIcon,
        type: 'bordered',
    }).getComponent();
    private lastPageBtn = new IconButton({
        icon: arrowDbRightIcon,
        type: 'bordered',
    }).getComponent();

    constructor(private currentPage: number, private maxPage: number) {
        super({ tag: 'div', classes: ['pagination'] });
        this.render();
    }

    public render(): void {
        const currentPageEl = this.createCurrentPage();
        if (this.currentPage === 1) {
            this.firstPageBtn.disabled = true;
            this.prevPageBtn.disabled = true;
        } else {
            this.firstPageBtn.disabled = false;
            this.prevPageBtn.disabled = false;
        }
        if (this.currentPage >= this.maxPage) {
            this.nextPageBtn.disabled = true;
            this.lastPageBtn.disabled = true;
        } else {
            this.nextPageBtn.disabled = false;
            this.lastPageBtn.disabled = false;
        }
        this.componentElem.innerHTML = '';
        this.componentElem.append(
            this.firstPageBtn,
            this.prevPageBtn,
            currentPageEl,
            this.nextPageBtn,
            this.lastPageBtn
        );
    }

    private createCurrentPage(): HTMLElement {
        const currentPageEl = createElement({
            tag: 'div',
            classes: ['pagination__current'],
            text: `${this.currentPage} / ${this.maxPage}`,
        });

        return currentPageEl;
    }

    public setFirstPageHandler(handler: () => void): void {
        this.firstPageBtn.addEventListener('click', handler);
    }

    public setNextPageHandler(handler: () => void): void {
        this.nextPageBtn.addEventListener('click', handler);
    }

    public setPrevPageHandler(handler: () => void): void {
        this.prevPageBtn.addEventListener('click', handler);
    }

    public setLastPageHandler(handler: () => void): void {
        this.lastPageBtn.addEventListener('click', handler);
    }
}
