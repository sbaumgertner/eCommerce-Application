import './catalog.scss';

import { RouteAction } from '../../store/action/routeAction';
import { PageName } from '../../types';

import createElement from '../../utils/create-element';
import { Page } from '../abstract/page';
import { IconButton } from '../../components/button/button';
import { getCategories } from '../../api/categories';
import { Loader } from '../../components/loader/loader';
import { Chips } from '../../components/chips/chips';

import arrowDownIcon from '../../assets/icons/icon-arrow-down.svg';
import resetIcon from '../../assets/icons/icon-reset.svg';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import { getProducts } from '../../api/products';
import { ProductCard } from '../../components/product-card/product-card';

export class CatalogPage extends Page {
    private routeAction: RouteAction;
    private categoriesBarEl = createElement({ tag: 'section', classes: ['categories-bar'] });
    private innerEl = createElement({ tag: 'div', classes: ['catalog-inner'] });
    private currentCategories =
        window.location.pathname.split('/').length === 2 ? 'all plants' : window.location.pathname.split('/')[2];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private categoriesData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private productsData: any;

    constructor() {
        super();
        this.routeAction = new RouteAction();
        this.setCategoriesData();
        this.setProductsData();
    }

    private async setCategoriesData(): Promise<unknown> {
        const data = (await getCategories()).results;
        this.categoriesData = data;
        this.createCategoriesBar();
        return data;
    }
    private async setProductsData(): Promise<unknown> {
        const data = (await getProducts({ queryArgs: { limit: 12, offset: 0 } })).results;
        console.log(data);
        this.productsData = data;
        this.createInner();
        return data;
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
        const categoriesBarEl = this.categoriesBarEl;
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'categories-bar__wrapper'] });
        const loaderEl = new Loader().getComponent();
        const listEl = createElement({ tag: 'div', classes: ['categories-bar__list'] });
        const headerEl = this.createBlockHeader('Categories', listEl);

        categoriesBarEl.innerHTML = '';

        if (this.categoriesData) {
            this.fillCategoriesList(listEl);
            wrapperEl.append(headerEl, listEl);
        } else {
            wrapperEl.append(headerEl, loaderEl);
        }
        categoriesBarEl.append(wrapperEl);
        return categoriesBarEl;
    }

    private fillCategoriesList(listEl: HTMLElement): void {
        this.categoriesData.forEach((element: { name: { en: string } }) => {
            const name = element.name.en.toLocaleLowerCase();
            const cheps = new Chips(
                element.name.en,
                `https://raw.githubusercontent.com/Illia-Sakharau/img-for-final-task/main/cat-${name}.png`
            );
            const chepsEl = cheps.getComponent();

            if (name === this.currentCategories) {
                cheps.setActive();
            }
            chepsEl.addEventListener('click', () => {
                this.currentCategories = name;
                this.routeAction.changePage({ addHistory: true, page: PageName.CATALOG, resource: name });
            });

            listEl.append(chepsEl);
        });
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
        const innerEl = this.innerEl;
        const headerEl = this.createInnerHeader();
        const cardGridEl = createElement({ tag: 'div', classes: ['catalog-inner__grid'] });
        const paginationEl = createElement({ tag: 'div', classes: ['catalog-inner__pagination'], text: 'PAGINATION' });
        const loaderEl = new Loader().getComponent();

        innerEl.innerHTML = '';

        if (this.productsData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.productsData.forEach((product: any) => {
                const productCard = new ProductCard();
                console.log(product);
                cardGridEl.append(productCard.getComponent());
            });
        } else {
            cardGridEl.append(loaderEl);
        }

        innerEl.append(headerEl, cardGridEl, paginationEl);
        return innerEl;
    }

    private createInnerHeader(): HTMLElement {
        const headerEl = createElement({ tag: 'div', classes: ['catalog-header'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['catalog-header__wrapper'] });
        const breadcrumbsEl = new Breadcrumbs(window.location.pathname).getComponent();
        const titleEl = createElement({
            tag: 'h3',
            classes: ['catalog-header__title'],
            text: this.currentCategories[0].toUpperCase() + this.currentCategories.slice(1),
        });
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
}
