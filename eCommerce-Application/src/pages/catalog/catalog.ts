import './catalog.scss';

import { RouteAction } from '../../store/action/routeAction';
import { PageName } from '../../types';

import createElement from '../../utils/create-element';
import { Page } from '../abstract/page';
import { IconButton } from '../../components/button/button';

import arrowDownIcon from '../../assets/icons/icon-arrow-down.svg';
import resetIcon from '../../assets/icons/icon-reset.svg';

export class CatalogPage extends Page {
    private routeAction: RouteAction;

    constructor() {
        super();
        this.routeAction = new RouteAction();
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.append(this.createSearchBar(), this.createCategoriesBar(), this.createMainContent());
    }

    private createSearchBar(): HTMLElement {
        const searchBarEl = createElement({ tag: 'section', classes: ['search-bar'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'search-bar__wrapper'] });
        const searchFieldEl = createElement({ tag: 'div', classes: ['search-bar__input'], text: 'SEARCH_FIELD' });

        wrapperEl.append(searchFieldEl);
        searchBarEl.append(wrapperEl);
        return searchBarEl;
    }

    private createCategoriesBar(): HTMLElement {
        const categoriesBarEl = createElement({ tag: 'section', classes: ['categories-bar'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'categories-bar__wrapper'] });
        const listEl = createElement({ tag: 'div', classes: ['categories-bar__list'], text: 'CATEGORIES_LIST' });
        const headerEl = this.createBlockHeader('Categories', listEl);

        wrapperEl.append(headerEl, listEl);
        categoriesBarEl.append(wrapperEl);
        return categoriesBarEl;
    }

    private createMainContent(): HTMLElement {
        const mainContentEl = createElement({ tag: 'section', classes: ['catalog-main'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'catalog-main__wrapper'] });
        const filterEl = this.createfilter();
        const innerEl = this.createInner();

        wrapperEl.append(filterEl, innerEl);
        mainContentEl.append(wrapperEl);
        return mainContentEl;
    }

    private createfilter(): HTMLElement {
        const filtertEl = createElement({ tag: 'div', classes: ['catalog-filter'] });
        const innerEl = createElement({ tag: 'div', classes: ['catalog-filter__inner'], text: 'FILTERS' });
        const resetBtnEl = new IconButton({ icon: resetIcon, type: 'clear' }).getComponent();
        const headerEl = this.createBlockHeader('Filters', innerEl, resetBtnEl);

        resetBtnEl.classList.add('negative');
        filtertEl.append(headerEl, innerEl);
        return filtertEl;
    }

    private createInner(): HTMLElement {
        const innerEl = createElement({ tag: 'div', classes: ['catalog-inner'] });
        const headerEl = this.createInnerHeader();
        const cardGridEl = createElement({ tag: 'div', classes: ['catalog-inner__grid'], text: 'GRID' });
        const paginationEl = createElement({ tag: 'div', classes: ['catalog-inner__pagination'], text: 'PAGINATION' });

        cardGridEl.append(this.createProduct('1'), this.createProduct('2'));

        innerEl.append(headerEl, cardGridEl, paginationEl);
        return innerEl;
    }

    private createInnerHeader(): HTMLElement {
        const headerEl = createElement({ tag: 'div', classes: ['catalog-header'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['catalog-header__wrapper'] });
        const breadcrumbsEl = createElement({
            tag: 'div',
            classes: ['catalog-header__breadcrumbs'],
            text: 'BREADCRUMBS',
        });
        const titleEl = createElement({ tag: 'h3', classes: ['catalog-header__title'], text: 'All Plants' });
        const sortEl = createElement({ tag: 'div', classes: ['catalog-header__sort'], text: 'SORT' });

        wrapperEl.append(breadcrumbsEl, titleEl);
        headerEl.append(wrapperEl, sortEl);
        return headerEl;
    }

    private createBlockHeader(title: string, hiddenContent: HTMLElement, additionalEl?: HTMLElement): HTMLElement {
        const headerEl = createElement({ tag: 'div', classes: ['block-header'] });
        const titleEl = createElement({ tag: 'h4', classes: ['block-header__title'], text: title });
        const btnEl = new IconButton({ icon: arrowDownIcon, type: 'clear' }).getComponent();
        btnEl.classList.add('block-header__show-btn');

        btnEl.addEventListener('click', () => {
            btnEl.classList.toggle('active');
            hiddenContent.classList.toggle('visible');
        });

        if (additionalEl) {
            headerEl.append(titleEl, additionalEl, btnEl);
        } else {
            headerEl.append(titleEl, btnEl);
        }
        return headerEl;
    }

    // delete
    private createProduct(id: string): HTMLElement {
        const product = createElement({ tag: 'div', classes: ['product'] });
        product.dataset.id = id;
        product.textContent = 'product ' + id;
        product.addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.PRODUCT, resource: id });
        });
        return product;
    }
}
