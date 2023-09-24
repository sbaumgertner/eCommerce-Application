import './product-card.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { EcomProductData, ProductID } from '../../types';
import { CartInteractionBar } from '../cart-interactions-bar/cart-interactions-bar';
import { CartStore } from '../../store/cart-store';
import { createProductURL } from '../../utils/create-product-url';

type ProductCardData = {
    id: ProductID;
    name: string;
    category: string;
    mainPrice: number;
    salePrice?: number;
    age: string;
    imgURL: string;
    description: string;
    url: string;
    key: string;
};

export class ProductCard extends Component {
    constructor(productData: ProductCardData, private cartStore: CartStore) {
        super({ tag: 'a', classes: ['product-card'] });
        this.componentElem.setAttribute('target', '_blank');
        this.componentElem.setAttribute('href', productData.url);
        this.render(productData);
    }

    public render(productInfo: ProductCardData): void {
        const { name, category, mainPrice, salePrice, age, imgURL, description, id } = productInfo;
        const headerEl = this.createHeader(name, category, mainPrice, salePrice);
        const buttonBarEl = this.createButtonbar(id);
        const ageEl = this.createAge(age);
        const imageEl = this.createImage(imgURL);
        const descriptionEl = this.createDescription(description);

        this.componentElem.append(ageEl, imageEl, headerEl, descriptionEl, buttonBarEl);
    }

    private createAge(age: string): HTMLElement {
        const ageEl = createElement({
            tag: 'div',
            classes: ['product-card__age', `product-card__age_${age.toLowerCase()}`],
            text: age,
        });

        return ageEl;
    }

    private createImage(imageURL: string): HTMLElement {
        const imageEl = createElement({ tag: 'div', classes: ['product-card__img'] });
        imageEl.style.background = `url(${imageURL}) 50%/cover no-repeat`;
        return imageEl;
    }

    private createHeader(name: string, category: string, mainPrice: number, salePrice?: number): HTMLElement {
        const headerEl = createElement({ tag: 'div', classes: ['product-card__header'] });
        const titlesWrapperEl = createElement({ tag: 'div', classes: ['product-card__titles-wrapper'] });
        const nameEl = createElement({ tag: 'div', classes: ['product-card__name'], text: name });
        const categoryEl = createElement({ tag: 'div', classes: ['product-card__category'], text: category });
        const mainPriceEl = this.createPrice(mainPrice);

        if (salePrice) {
            const salePriceEl = this.createPrice(salePrice);
            salePriceEl.classList.add('product-card__price_sale');
            mainPriceEl.append(salePriceEl);
        }
        titlesWrapperEl.append(categoryEl, nameEl);

        headerEl.append(titlesWrapperEl, mainPriceEl);
        return headerEl;
    }

    private createPrice(price: number): HTMLElement {
        const priceEl = createElement({ tag: 'div', classes: ['product-card__price'] });
        const currencyEl = createElement({ tag: 'span', classes: ['product-card__currency'], text: '$' });
        const intEl = createElement({
            tag: 'span',
            classes: ['product-card__int'],
            text: `${Math.trunc(price / 100)}`,
        });
        const decEl = createElement({
            tag: 'span',
            classes: ['product-card__dec'],
            text: `.${price - Math.trunc(price / 100) * 100}`,
        });

        priceEl.append(currencyEl, intEl, decEl);
        return priceEl;
    }

    private createDescription(description: string): HTMLElement {
        const descriptionEl = createElement({ tag: 'div', classes: ['product-card__description'], text: description });

        return descriptionEl;
    }

    private createButtonbar(productID: ProductID): HTMLElement {
        const btnBarEl = new CartInteractionBar({ type: 'bordered', productID }, this.cartStore).getComponent();
        btnBarEl.classList.add('product-card__button-bar');
        return btnBarEl;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function productDataAdapter(product: EcomProductData, categoriesData: any[]): ProductCardData {
    try {
        const id = product.id;
        const name = product.name.en;
        const category = categoriesData.find((catigory: { id: string }) => catigory.id === product.categories[0].id)
            .name.en;
        const mainPrice = product.masterVariant.prices[0].value.centAmount;
        const salePrice = product.masterVariant.prices[0].discounted?.value.centAmount;
        const ageData = product.masterVariant.attributes.find((attr: { name: string }) => attr.name === 'agePlants');
        const age = ageData ? ageData.value.label : '';
        const imgURL = product.masterVariant.images[0].url;
        const description = product.metaDescription.en;
        const url = createProductURL(product.key, 'catalog');
        const key = product.key;

        return { id, name, category, mainPrice, salePrice, age, imgURL, description, url, key };
    } catch (error) {
        return {
            id: '',
            name: '',
            category: '',
            mainPrice: 0,
            age: '',
            imgURL: '',
            description: '',
            url: '',
            key: '',
        };
    }
}
