import { PageName, StoreEventType } from '../types';
import { AppStore } from '../store/app-store';
import Header from '../components/header/header';
import { HomePage } from './home/home';

import { NotFoundPage } from './notfound/notfound';
import { LoginPage } from './login/login';

import { RegisterPage } from './registration/registration';
import { Page } from './abstract/page';
import Footer from '../components/footer/footer';
import { AccountPage } from './account/account';
import { CatalogPage } from './catalog/catalog';
import { ProductPage } from './product/product';
import { CartPage } from './cart/cart';
import { AboutPage } from './about/about';
import { CartStore } from '../store/cart-store';

export class Layout extends Page {
    private appStore: AppStore;
    private cartStore: CartStore;

    private header: Header;
    private main: Page;
    private footer: Footer;
    private loginPage: LoginPage;
    private accountPage: AccountPage;
    private catalogPage: CatalogPage;
    private productPage: ProductPage;
    private cartPage: CartPage;
    private aboutPage: AboutPage;

    private notFound = new NotFoundPage();
    private home: HomePage;
    private mainEl: HTMLElement;

    constructor(appStore: AppStore, cartStore: CartStore) {
        super();
        this.appStore = appStore;
        this.cartStore = cartStore;

        this.home = new HomePage(this.appStore);
        this.loginPage = new LoginPage(this.appStore);
        this.accountPage = new AccountPage(this.appStore);
        this.catalogPage = new CatalogPage(this.appStore, this.cartStore);
        this.productPage = new ProductPage(this.appStore);
        this.cartPage = new CartPage(this.appStore, this.cartStore);
        this.aboutPage = new AboutPage();

        this.header = new Header(this.appStore, this.cartStore);
        this.main = this.home;
        this.footer = new Footer(this.appStore);

        this.mainEl = document.createElement('main');
        this.appStore.addChangeListener(StoreEventType.PAGE_CHANGE, this.onStoreChange.bind(this));
    }

    protected onStoreChange(): void {
        const page: PageName = this.appStore.getCurrentPage();
        switch (page) {
            case PageName.INDEX:
                this.updateMainView(this.home);
                break;
            case PageName.LOGIN:
                this.updateMainView(this.loginPage);
                break;
            case PageName.REGISTRATION:
                this.updateMainView(new RegisterPage(this.appStore));
                break;
            case PageName.ACCOUNT:
                this.updateMainView(this.accountPage);
                break;
            case PageName.CART:
                this.updateMainView(this.cartPage);
                break;
            case PageName.PRODUCT:
                this.updateMainView(this.productPage);
                break;
            case PageName.CATALOG:
                this.updateMainView(this.catalogPage);
                break;
            case PageName.ABOUT_US:
                this.updateMainView(this.aboutPage);
                break;
            case PageName.NOT_FOUND:
                this.updateMainView(this.notFound);
                break;
        }
    }

    private updateMainView(page: Page): void {
        this.mainEl.innerHTML = '';
        this.main = page;
        this.main.render();
        this.mainEl.append(this.main.getHtml());
    }

    public render(): void {
        this.header.render();
        this.footer.render();
        this.main.render();
        this.mainEl.append(this.main.getHtml());
        document.body.append(this.header.getComponent(), this.mainEl, this.footer.getComponent());
    }
}
