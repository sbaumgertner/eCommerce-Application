import './product-card.scss';

import createElement from '../../utils/create-element';
import Component from '../abstract/component';
import { Button } from '../button/button';

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

const testData = {
    name: 'Thai Constellation',
    category: 'Monstera',
    mainPrice: 3950,
    salePrice: 2999,
    age: 'Baby',
    imgURL: 'https://plnts.com/_next/image?url=https%3A%2F%2Fwebshop.plnts.com%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2Faa5d334f459227518b6c3cf7ea9d29ed%2Fp%2Fl%2Fpl_m_014-thumbnail_5.jpg&w=1080&q=80',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
    url: '/product/1',
};

export class ProductCard extends Component {
    constructor() {
        super({ tag: 'a', classes: ['product-card'] });
        this.componentElem.setAttribute('href', testData.url);
        this.render(testData);
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
