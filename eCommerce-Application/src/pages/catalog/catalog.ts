import './catalog.scss';

import { RouteAction } from '../../store/action/routeAction';
import { CategoriesImg, EcomProductData, PageName, StoreEventType } from '../../types';

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
import InputField from '../../components/input-field/input-field';

import searchIcon from '../../assets/icons/icon-search.svg';
import Input from '../../components/input/input';
import { Select } from '../../components/select/select';
import { CartStore } from '../../store/cart-store';

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
const PLANT_AGE_FILTERS = [
    {
        key: 'seed',
        value: 'Seed',
    },
    {
        key: 'baby',
        value: 'Baby',
    },
    {
        key: 'adult',
        value: 'Adult',
    },
];
const SORT: Map<string, string> = new Map([
    ['', 'Default'],
    ['name.en asc', 'Name (a → z)'],
    ['name.en desc', 'Name (z → a)'],
    ['price asc', 'Price (asc)'],
    ['price desc', 'Price (desc)'],
]);
const MIN_PRICE = 1;
const MAX_PRICE = 37;

type CatalogPageData = {
    currentCategories: string;
    currentPage: number;
    maxCardPerPage: number;
    sizeFilters: string[];
    ageFilters: string[];
    priceFilters: {
        min: number;
        max: number;
    };
    saleFilters: boolean;
    searchText: string;
    sortBy: string;
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

    constructor(private appStore: AppStore, private cartStore: CartStore) {
        super();
        this.html = document.createElement('div');
        this.routeAction = new RouteAction();
        this.pageInfo = {
            currentCategories: 'all plants',
            currentPage: 1,
            maxCardPerPage: 12,
            sizeFilters: [],
            ageFilters: [],
            priceFilters: {
                min: MIN_PRICE,
                max: MAX_PRICE,
            },
            saleFilters: false,
            searchText: '',
            sortBy: '',
        };
        this.appStore.addChangeListener(StoreEventType.PAGE_CHANGE, this.onStoreChange.bind(this));
    }

    private async setCategoriesData(): Promise<unknown> {
        this.categoriesData = undefined;
        this.productsData = undefined;
        this.totalProducts = 0;
        const data = (await getCategories()).results;
        this.categoriesData = data;
        this.pageInfo.currentPage = 1;
        this.setProductsData();
        this.createCategoriesBar();
        return data;
    }
    private async setProductsData(): Promise<unknown> {
        const filter = this.createFilterReqest();
        const queryArgs = {
            filter,
            'text.en': this.pageInfo.searchText,
            fuzzy: true,
            sort: [this.pageInfo.sortBy],
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

    // eslint-disable-next-line max-lines-per-function
    private createFilterReqest(): string[] {
        const filterReqest: string[] = [];
        try {
            // Categories
            if (this.pageInfo.currentCategories && this.pageInfo.currentCategories !== 'all plants') {
                filterReqest.push(
                    `categories.id:"${
                        this.categoriesData.find(
                            (cat: { slug: { en: string } }) => cat.slug.en === this.pageInfo.currentCategories
                        ).id
                    }"`
                );
            }
        } catch (err) {
            console.log('Categories filter error');
        }
        try {
            // Plant Size
            if (this.pageInfo.sizeFilters.length !== 0) {
                filterReqest.push(`variants.attributes.sizePlants.key:"${this.pageInfo.sizeFilters.join('","')}"`);
            }
        } catch (err) {
            console.log('Plant Size filter error');
        }
        try {
            // Plant Age
            if (this.pageInfo.ageFilters.length !== 0) {
                filterReqest.push(`variants.attributes.agePlants.key:"${this.pageInfo.ageFilters.join('","')}"`);
            }
        } catch (err) {
            console.log('Plant Age filter error');
        }
        try {
            // Sale
            if (this.pageInfo.saleFilters) {
                filterReqest.push(`variants.attributes.isOnSale: "true"`);
            }
        } catch (err) {
            console.log('Sale filter error');
        }
        try {
            // Price
            filterReqest.push(
                `variants.price.centAmount:range (
                ${this.pageInfo.priceFilters.min * 100} to 
                ${this.pageInfo.priceFilters.max * 100})`
            );
        } catch (err) {
            console.log('Price filter error');
        }
        return filterReqest;
    }

    private createSearchBar(): HTMLElement {
        const searchBarEl = createElement({ tag: 'section', classes: ['search-bar'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'search-bar__wrapper'] });
        const searchField = new Input({
            classes: ['input', 'search-bar__input'],
            type: 'text',
            name: 'search',
            placeholder: 'Type plant name',
        });
        const searchBtnEl = new IconButton({
            icon: searchIcon,
            type: 'clear',
        }).getComponent();

        searchField.setValue(this.pageInfo.searchText);
        searchBtnEl.addEventListener('click', () => {
            this.pageInfo.searchText = searchField.getValue();
            this.pageInfo.currentPage = 1;
            this.setProductsData();
            this.createInner();
        });

        searchField.getComponent().addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                this.pageInfo.searchText = searchField.getValue();
                this.pageInfo.currentPage = 1;
                this.setProductsData();
                this.createInner();
            }
        });

        wrapperEl.append(searchField.getComponent(), searchBtnEl);
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
            const categoriesImgArr = Object.entries(CategoriesImg).find((cat) => cat[0] === name) as string[];
            const cheps = new Chips(element.name.en, categoriesImgArr[1]);
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
        const resetBtnEl = this.createResetFilterBtn();
        const headerEl = this.createBlockHeader('Filters', innerEl, resetBtnEl);

        filtertEl.append(headerEl, innerEl);
        return filtertEl;
    }

    private createResetFilterBtn(): HTMLElement {
        const resetBtnEl = new IconButton({ icon: resetIcon, type: 'clear' }).getComponent();

        resetBtnEl.classList.add('negative');
        resetBtnEl.addEventListener('click', () => {
            this.pageInfo.sizeFilters = [];
            this.pageInfo.ageFilters = [];
            this.pageInfo.priceFilters.min = MIN_PRICE;
            this.pageInfo.priceFilters.max = MAX_PRICE;
            this.pageInfo.saleFilters = false;
            this.render();
        });
        return resetBtnEl;
    }

    private createFilterInner(): HTMLElement {
        const innerEl = createElement({ tag: 'div', classes: ['catalog-filter__inner'] });
        const plantsSizeEl = this.createPlantsSizeFilter();
        const plantsAgeEl = this.createPlantsAgeFilter();
        const priceEl = this.createPlantsPriceFilter();
        const saleEl = this.createPlantsSaleFilter();
        innerEl.append(plantsSizeEl, plantsAgeEl, priceEl, saleEl);
        return innerEl;
    }

    private createPlantsSizeFilter(): HTMLElement {
        const plantsSizeEl = createElement({ tag: 'div', classes: ['catalog-filter__block'] });
        const titleEl = createElement({ tag: 'h5', classes: ['catalog-filter__title'], text: 'Plant Size' });
        const listEl = createElement({ tag: 'div', classes: ['catalog-filter__list'] });

        PLANT_SIZE_FILTERS.forEach((element) => {
            const sizeArr = this.pageInfo.sizeFilters;
            const cheps = new Chips(element.value);
            const chepsEl = cheps.getComponent();

            if (sizeArr.includes(element.key)) {
                cheps.setActive();
            }

            chepsEl.addEventListener('click', () => {
                const index = sizeArr.indexOf(element.key);
                if (index === -1) {
                    sizeArr.push(element.key);
                } else {
                    sizeArr.splice(index, 1);
                }

                this.pageInfo.currentPage = 1;
                this.setProductsData();
                this.createInner();
            });

            listEl.append(chepsEl);
        });

        plantsSizeEl.append(titleEl, listEl);
        return plantsSizeEl;
    }

    private createPlantsAgeFilter(): HTMLElement {
        const plantsAgeEl = createElement({ tag: 'div', classes: ['catalog-filter__block'] });
        const titleEl = createElement({ tag: 'h5', classes: ['catalog-filter__title'], text: 'Age of Plants' });
        const listEl = createElement({ tag: 'div', classes: ['catalog-filter__list'] });

        PLANT_AGE_FILTERS.forEach((element) => {
            const ageArr = this.pageInfo.ageFilters;
            const cheps = new Chips(element.value);
            const chepsEl = cheps.getComponent();

            if (ageArr.includes(element.key)) {
                cheps.setActive();
            }

            chepsEl.addEventListener('click', () => {
                const index = ageArr.indexOf(element.key);
                if (index === -1) {
                    ageArr.push(element.key);
                } else {
                    ageArr.splice(index, 1);
                }

                this.pageInfo.currentPage = 1;
                this.setProductsData();
                this.createInner();
            });

            listEl.append(chepsEl);
        });

        plantsAgeEl.append(titleEl, listEl);
        return plantsAgeEl;
    }

    private createPlantsPriceFilter(): HTMLElement {
        const plantsPriceEl = createElement({ tag: 'div', classes: ['catalog-filter__block'] });
        const titleEl = createElement({ tag: 'h5', classes: ['catalog-filter__title'], text: 'Price ($)' });
        const listEl = createElement({ tag: 'div', classes: ['catalog-filter__list'] });

        const fieldsWrapperEl = createElement({ tag: 'div', classes: ['catalog-filter__wrapper'] });
        const minField = this.createMinPriceField();
        const maxField = this.createMaxPriceField();

        fieldsWrapperEl.append(minField, maxField);
        listEl.append(fieldsWrapperEl);

        plantsPriceEl.append(titleEl, listEl);
        return plantsPriceEl;
    }

    private createMinPriceField(): HTMLElement {
        const param = this.pageInfo.priceFilters;
        const minField = new InputField('number', 'min', 'min', `${MIN_PRICE}`);
        const minInput = minField.getComponent().querySelector('.input') as HTMLInputElement;
        minField.setValue(`${param.min}`);

        minInput.min = `${MIN_PRICE}`;
        minInput.max = `${param.max}`;

        minInput.addEventListener('change', () => {
            if (+minInput.value >= param.max) {
                minInput.value = `${param.max - 1}`;
            }
            if (+minInput.value < MIN_PRICE) {
                minInput.value = `${MIN_PRICE}`;
            }
            param.min = +minInput.value;

            this.pageInfo.currentPage = 1;
            this.setProductsData();
            this.createInner();
        });
        return minField.getComponent();
    }

    private createMaxPriceField(): HTMLElement {
        const param = this.pageInfo.priceFilters;
        const maxField = new InputField('number', 'max', 'max', `${MAX_PRICE}`);
        const maxInput = maxField.getComponent().querySelector('.input') as HTMLInputElement;
        maxField.setValue(`${param.max}`);

        maxInput.min = `${param.min}`;
        maxInput.max = `${MAX_PRICE}`;

        maxInput.addEventListener('change', () => {
            if (+maxInput.value > MAX_PRICE) {
                maxInput.value = `${MAX_PRICE}`;
            }
            if (+maxInput.value <= param.min) {
                maxInput.value = `${param.min + 1}`;
            }
            param.max = +maxInput.value;

            this.pageInfo.currentPage = 1;
            this.setProductsData();
            this.createInner();
        });
        return maxField.getComponent();
    }

    private createPlantsSaleFilter(): HTMLElement {
        const plantsSaleEl = createElement({ tag: 'div', classes: ['catalog-filter__block'] });
        const titleEl = createElement({ tag: 'h5', classes: ['catalog-filter__title'], text: 'Sale' });
        const listEl = createElement({ tag: 'div', classes: ['catalog-filter__list'] });
        const cheps = new Chips('Discounted items');
        const chepsEl = cheps.getComponent();

        if (this.pageInfo.saleFilters) {
            cheps.setActive();
        }

        chepsEl.addEventListener('click', () => {
            this.pageInfo.saleFilters = !this.pageInfo.saleFilters;

            this.pageInfo.currentPage = 1;
            this.setProductsData();
            this.createInner();
        });

        listEl.append(chepsEl);

        plantsSaleEl.append(titleEl, listEl);
        return plantsSaleEl;
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
                const productCard = new ProductCard(productData, this.cartStore);
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
        try {
            const wrapperEl = createElement({ tag: 'div', classes: ['catalog-header__wrapper'] });
            const breadcrumbsEl = new Breadcrumbs(window.location.href).getComponent();
            const titleEl = createElement({
                tag: 'h3',
                classes: ['catalog-header__title'],
                text: `${
                    this.pageInfo.currentCategories[0].toUpperCase() + this.pageInfo.currentCategories.slice(1)
                } (${this.totalProducts})`,
            });
            const sortEl = this.createSortBar();

            wrapperEl.append(breadcrumbsEl, titleEl);
            headerEl.append(wrapperEl, sortEl);
        } catch (error) {
            console.log('');
        }
        return headerEl;
    }

    private createSortBar(): HTMLElement {
        const sortEl = createElement({ tag: 'div', classes: ['sort-bar', 'catalog-header__sort-bar'] });
        const labelEl = createElement({ tag: 'span', classes: ['sort-bar__title'], text: 'Sort by' });
        const selectEl = new Select({ classes: ['sort-bar__input'], options: SORT });

        selectEl.setValue(this.pageInfo.sortBy);

        selectEl.getComponent().addEventListener('change', () => {
            this.pageInfo.sortBy = selectEl.getValue();
            this.pageInfo.currentPage = 1;
            this.setProductsData();
            this.createInner();
        });
        sortEl.append(labelEl, selectEl.getComponent());
        return sortEl;
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
        const locationArr = window.location.pathname.split('/');
        this.pageInfo.currentCategories =
            locationArr.indexOf('catalog') === locationArr.length - 1
                ? 'all plants'
                : locationArr[locationArr.length - 1];
        this.render();
    }
}
