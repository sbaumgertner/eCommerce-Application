import './product-card.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { Button } from '../button/button';
import { EcomProductData } from '../../types';

type ProductCardData = {
    name: string;
    category: string;
    mainPrice: number;
    salePrice?: number;
    age: string;
    imgURL: string;
    description: string;
    url: string;
};

export class ProductCard extends Component {
    constructor(productData: ProductCardData) {
        super({ tag: 'a', classes: ['product-card'] });
        this.componentElem.setAttribute('target', '_blank');
        this.componentElem.setAttribute('href', productData.url);
        this.render(productData);
    }

    public render(productInfo: ProductCardData): void {
        const { name, category, mainPrice, salePrice, age, imgURL, description } = productInfo;
        const headerEl = this.createHeader(name, category, mainPrice, salePrice);
        const buttonBarEl = this.createButtonbar();
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

    private createButtonbar(): HTMLElement {
        const btnBarEl = createElement({ tag: 'div', classes: ['product-card__button-bar'] });
        const addToCardBtnEl = new Button('bordered', undefined, 'Add to cart').getComponent();

        addToCardBtnEl.addEventListener('click', (e: Event) => {
            e.preventDefault();
            console.log('Add to cart');
        });

        btnBarEl.append(addToCardBtnEl);
        return btnBarEl;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function productDataAdapter(product: EcomProductData, categoriesData: any[]): ProductCardData {
    try {
        const name = product.name.en;
        const category = categoriesData.find((catigory: { id: string }) => catigory.id === product.categories[0].id)
            .name.en;
        const mainPrice = product.masterVariant.prices[0].value.centAmount;
        const salePrice = product.masterVariant.prices[0].discounted?.value.centAmount;
        const ageData = product.masterVariant.attributes.find((attr: { name: string }) => attr.name === 'agePlants');
        const age = ageData ? ageData.value.label : '';
        const imgURL = product.masterVariant.images[0].url;
        const description = product.metaDescription.en;
        const url = `/product/${product.key}`;

        return {
            name,
            category,
            mainPrice,
            salePrice,
            age,
            imgURL,
            description,
            url,
        };
    } catch (error) {
        return {
            name: '',
            category: '',
            mainPrice: 0,
            age: '',
            imgURL: '',
            description: '',
            url: '',
        };
    }
}
