import './catalog.scss';

import { RouteAction } from '../../store/action/routeAction';
import { EcomProductData, PageName, StoreEventType } from '../../types';

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
import { ProductCard, productDataAdapter } from '../../components/product-card/product-card';
import { AppStore } from '../../store/app-store';
import { Pagination } from '../../components/pagination/pagination';

const PLANT_SIZE_FILTERS = [
    {
        key: 'mini',
        value: 'Mini (2” - 3” Pot)',
    },
    {
        key: 'small',
        value: 'Small (4” Pot)',
    },
    {
        key: 'medium',
        value: 'Medium (6” Pot)',
    },
    {
        key: 'large',
        value: 'Large (8” - 10” Pot)',
    },
];

type CatalogPageData = {
    currentCategories: string;
    currentPage: number;
    maxCardPerPage: number;
    filters?: {
        name: string;
        value: string[];
    }[];
};

export class CatalogPage extends Page {
    private routeAction: RouteAction;
    private categoriesBarEl = createElement({ tag: 'section', classes: ['categories-bar'] });
    private innerEl = createElement({ tag: 'div', classes: ['catalog-inner'] });
    private pageInfo: CatalogPageData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private categoriesData: any = [];
    private productsData: EcomProductData[] | undefined;
    private totalProducts = 0;

    constructor(private appStore: AppStore) {
        super();
        this.html = document.createElement('div');
        this.routeAction = new RouteAction();
        this.pageInfo = {
            currentCategories:
                window.location.pathname.split('/').length === 2
                    ? 'all plants'
                    : window.location.pathname.split('/')[2],
            currentPage: 1,
            maxCardPerPage: 12,
        };
        this.appStore.addChangeListener(StoreEventType.PAGE_CHANGE, this.onStoreChange.bind(this));
    }

    private async setCategoriesData(): Promise<unknown> {
        this.categoriesData = undefined;
        this.productsData = undefined;
        this.totalProducts = 0;
        const data = (await getCategories()).results;
        this.categoriesData = data;
        this.setProductsData();
        this.createCategoriesBar();
        return data;
    }
    private async setProductsData(): Promise<unknown> {
        const filter = this.createFilterReqest();
        const queryArgs = {
            filter,
            limit: this.pageInfo.maxCardPerPage,
            offset: (this.pageInfo.currentPage - 1) * this.pageInfo.maxCardPerPage,
        };
        this.productsData = undefined;
        this.totalProducts = 0;
        const data = await getProducts({ queryArgs });
        this.totalProducts = data.total || 0;
        this.productsData = data.results as unknown as EcomProductData[];
        this.createInner();
        return data;
    }

    public render(): void {
        if (this.html) {
            this.html.innerHTML = '';
            this.setCategoriesData();
            this.html.append(this.createSearchBar(), this.createCategoriesBar(), this.createMainContent());
        }
    }

    private createFilterReqest(): string[] {
        const filterReqest: string[] = [];
        try {
            if (this.pageInfo.currentCategories && this.pageInfo.currentCategories !== 'all plants') {
                filterReqest.push(
                    `categories.id:"${
                        this.categoriesData.find(
                            (cat: { slug: { en: string } }) => cat.slug.en === this.pageInfo.currentCategories
                        ).id
                    }"`
                );
            }

            // Plant Size
            // filterReqest.push(`variants.attributes.agePlants.key:"seed", "mini"`);

            // const arr = ['seed', 'adult'];
            // // Age of Plants
            // filterReqest.push(`variants.attributes.agePlants.key:"${arr.join('","')}"`);

            // Price
            // filterReqest.push(`variants.price.centAmount:range (500 to 1500)`);

            // Sale
            // filterReqest.push(`variants.attributes.isOnSale: "true"`);
        } catch (err) {
            console.log('');
        }
        return filterReqest;
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

            if (name === this.pageInfo.currentCategories) {
                cheps.setActive();
            }
            chepsEl.addEventListener('click', () => {
                this.pageInfo.currentPage = 1;
                if (this.pageInfo.currentCategories === name) {
                    this.pageInfo.currentCategories = 'all plants';
                    this.routeAction.changePage({ addHistory: true, page: PageName.CATALOG });
                } else {
                    this.pageInfo.currentCategories = name;
                    this.routeAction.changePage({ addHistory: true, page: PageName.CATALOG, resource: name });
                }
            });

            listEl.append(chepsEl);
        });
    }

    private createMainContent(): HTMLElement {
        const mainContentEl = createElement({ tag: 'section', classes: ['catalog-main'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'catalog-main__wrapper'] });
        const filterEl = this.createFilter();
        const innerEl = this.createInner();

        wrapperEl.append(filterEl, innerEl);
        mainContentEl.append(wrapperEl);
        return mainContentEl;
    }

    private createFilter(): HTMLElement {
        const filtertEl = createElement({ tag: 'div', classes: ['catalog-filter'] });
        const innerEl = this.createFilterInner();
        const resetBtnEl = new IconButton({ icon: resetIcon, type: 'clear' }).getComponent();
        const headerEl = this.createBlockHeader('Filters', innerEl, resetBtnEl);

        resetBtnEl.classList.add('negative');
        filtertEl.append(headerEl, innerEl);
        return filtertEl;
    }

    private createFilterInner(): HTMLElement {
        const innerEl = createElement({ tag: 'div', classes: ['catalog-filter__inner'] });
        const plantsSizeEl = this.createPlantsSizeFilter();
        const plantsAgeEl = createElement({ tag: 'div', classes: ['catalog-filter__block'], text: 'plantsAge' });
        const priceEl = createElement({ tag: 'div', classes: ['catalog-filter__block'], text: 'PRICE' });
        const saleEl = createElement({ tag: 'div', classes: ['catalog-filter__block'], text: 'SALE' });
        innerEl.append(plantsSizeEl, plantsAgeEl, priceEl, saleEl);
        return innerEl;
    }

    private createPlantsSizeFilter(): HTMLElement {
        const plantsSizeEl = createElement({ tag: 'div', classes: ['catalog-filter__block'] });
        const titleEl = createElement({ tag: 'h5', classes: ['catalog-filter__title'], text: 'Plant Size' });
        const listEl = createElement({ tag: 'div', classes: ['catalog-filter__list'] });

        PLANT_SIZE_FILTERS.forEach((element) => {
            const cheps = new Chips(element.value);
            const chepsEl = cheps.getComponent();

            // if (name === this.pageInfo.currentCategories) {
            //     cheps.setActive();
            // }
            // chepsEl.addEventListener('click', () => {
            //     this.pageInfo.currentPage = 1;
            //     if (this.pageInfo.currentCategories === name) {
            //         this.pageInfo.currentCategories = 'all plants';
            //         this.routeAction.changePage({ addHistory: true, page: PageName.CATALOG });
            //     } else {
            //         this.pageInfo.currentCategories = name;
            //         this.routeAction.changePage({ addHistory: true, page: PageName.CATALOG, resource: name });
            //     }
            // });

            listEl.append(chepsEl);
        });

        plantsSizeEl.append(titleEl, listEl);
        return plantsSizeEl;
    }

    private createInner(): HTMLElement {
        const innerEl = this.innerEl;
        const headerEl = this.createInnerHeader();
        const cardGridEl = this.createProductGrid();
        const paginationEl = this.createPagination();

        innerEl.innerHTML = '';

        innerEl.append(headerEl, cardGridEl, paginationEl);
        return innerEl;
    }

    private createProductGrid(): HTMLElement {
        const cardGridEl = createElement({ tag: 'div', classes: ['catalog-inner__grid'] });
        const loaderEl = new Loader().getComponent();
        if (this.productsData) {
            this.productsData.forEach((product) => {
                const productData = productDataAdapter(product, this.categoriesData);
                const productCard = new ProductCard(productData);
                cardGridEl.append(productCard.getComponent());
            });
        } else {
            cardGridEl.append(loaderEl);
        }

        return cardGridEl;
    }

    private createPagination(): HTMLElement {
        const currentPage = this.pageInfo.currentPage;
        const maxPage = Math.ceil(this.totalProducts / this.pageInfo.maxCardPerPage);
        const paginationEl = new Pagination(currentPage, maxPage);
        paginationEl.setFirstPageHandler(() => {
            this.pageInfo.currentPage = 1;
            this.setProductsData();
            this.createInner();
        });
        paginationEl.setPrevPageHandler(() => {
            this.pageInfo.currentPage -= 1;
            this.setProductsData();
            this.createInner();
        });
        paginationEl.setNextPageHandler(() => {
            this.pageInfo.currentPage += 1;
            this.setProductsData();
            this.createInner();
        });
        paginationEl.setLastPageHandler(() => {
            this.pageInfo.currentPage = maxPage;
            this.setProductsData();
            this.createInner();
        });

        return paginationEl.getComponent();
    }

    private createInnerHeader(): HTMLElement {
        const headerEl = createElement({ tag: 'div', classes: ['catalog-header'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['catalog-header__wrapper'] });
        const breadcrumbsEl = new Breadcrumbs(window.location.pathname).getComponent();
        const titleEl = createElement({
            tag: 'h3',
            classes: ['catalog-header__title'],
            text: `${this.pageInfo.currentCategories[0].toUpperCase() + this.pageInfo.currentCategories.slice(1)} (${
                this.totalProducts
            })`,
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

    protected onStoreChange(): void {
        this.pageInfo.currentCategories =
            window.location.pathname.split('/').length === 2 ? 'all plants' : window.location.pathname.split('/')[2];
        this.render();
    }
}
