import './product.scss';
import { AppStore } from '../../store/app-store';
import { ProductStore } from '../../store/product-store';
import { CategoriesImg, ProductData, ProductID } from '../../types';
import createElement from '../../utils/create-element';
import { Page } from '../abstract/page';
import { Slider } from '../../components/slider/slider';
import { Modal } from '../../components/modal/modal';
import { CartStore } from '../../store/cart-store';
import { CartInteractionBar } from '../../components/cart-interactions-bar/cart-interactions-bar';

export class ProductPage extends Page {
    private productStore: ProductStore;
    private data?: ProductData;

    private slider?: Slider;
    private modalSlider?: Slider;
    private modal?: Modal;

    constructor(private appStore: AppStore, private cartStore: CartStore) {
        super();
        this.productStore = new ProductStore();
    }

    public async render(): Promise<void> {
        this.html = document.createElement('div');
        this.html.className = 'product-page';

        const resource: string = this.appStore.getCurrentPageResource();
        await this.productStore.setDataFromAPI(resource);
        this.data = this.productStore.getProduct();

        this.html.append(this.createContent(), this.createSlider());
        this.createModal();
        this.addEventListeners();
    }

    private createContent(): HTMLElement {
        const content = createElement({ tag: 'div', classes: ['product-content'] });
        content.append(this.createTitle(), this.createPrice(), this.createAttributes(), this.createDescription());
        return content;
    }

    private createTitle(): HTMLElement {
        const name = this.data?.category.toLowerCase();
        const html = createElement({ tag: 'div', classes: ['product-title'] });
        const categoriesImgArr = Object.entries(CategoriesImg).find((cat) => cat[0] === name) as string[];
        html.innerHTML = `
            <div class="product-title__header">
                <p class="product-title__category">${this.data?.category}</p>
                <p class="product-title__name">${this.data?.name}</p>
            </div>
            <div class="product-title__image-wrap">
                <img class="product-title__image" alt="category image" src="${categoriesImgArr[1]}">
            </div>
        `;
        return html;
    }

    private createPrice(): HTMLElement {
        const html = createElement({ tag: 'div', classes: ['product-price'] });
        const productID = this.data?.productID as ProductID;
        const btnBarEl = new CartInteractionBar({ type: 'filled', productID }, this.cartStore).getComponent();

        btnBarEl.classList.add('product__button-bar');

        html.append(btnBarEl);
        html.append(this.createPriceValues());
        return html;
    }

    private calcCentStr(price: number): string {
        let centStr = String(price % 100);
        if (centStr.length < 2) {
            centStr = '0' + centStr;
        }
        return '.' + centStr;
    }

    private createPriceValues(): HTMLElement {
        const price = this.data?.price as number;
        const discount = this.data?.discountPrice;

        const html = createElement({ tag: 'div', classes: ['product-price-values'] });
        html.innerHTML = `
            <div class="price-discount ${discount ? '' : 'hidden'}">
                <span class="price-currency">$</span>
                <span class="price-dollars">${Math.floor(Number(discount) / 100)}</span>
                <span class="price-cents">${this.calcCentStr(Number(discount))}</span>
            </div>
            <div class="price-value ${discount ? 'discounted' : ''}">
                <span class="price-currency">$</span>
                <span class="price-dollars">${Math.floor(price / 100)}</span>
                <span class="price-cents">${this.calcCentStr(price)}</span>
            </div>
        `;
        return html;
    }

    private createAttribute(header: string, text: string): HTMLElement {
        const html = createElement({ tag: 'div', classes: ['product-attr'] });
        html.innerHTML = `
            <p class="product-attr__header">${header}</p>
            <p class="product-attr__text">${text}</p>
        `;
        return html;
    }

    private createAttributes(): HTMLElement {
        const html = createElement({ tag: 'div', classes: ['product-attrs'] });
        html.append(this.createAttribute('Plant Size', this.data?.size as string));
        html.append(this.createAttribute('Age of Plants', this.data?.age as string));
        return html;
    }

    private createDescription(): HTMLElement {
        const html = createElement({ tag: 'div', classes: ['product-descr'] });
        html.innerHTML = `
            <p class="product-descr__header">About ${this.data?.name}</p>
            <p class="product-descr__text">${this.data?.description}</p>
        `;
        return html;
    }

    private createSlider(): HTMLElement {
        const sliderWrap = createElement({ tag: 'div', classes: ['product-slider'] });
        this.slider = new Slider(this.data?.images as string[]);
        sliderWrap.append(this.slider.getComponent());
        return sliderWrap;
    }

    private createModal(): void {
        this.modalSlider = new Slider(this.data?.images as string[]);
        this.modal = new Modal(this.modalSlider.getComponent());
    }

    private addEventListeners(): void {
        this.slider
            ?.getComponent()
            .querySelector('.slider__wrapper')
            ?.addEventListener('click', () => {
                this.modalSlider?.setToNumber(this.slider?.getCurrentNumber() as number);
                this.modal?.openModal();
            });
    }
}
