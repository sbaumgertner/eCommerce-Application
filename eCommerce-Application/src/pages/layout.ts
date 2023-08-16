import { PageName, StoreEventType } from '../types';
import { AppStore } from '../store/app-store';
import { Header } from '../components/header/header';
import { MainPage } from './main-page';
import { LoginPage } from './login-page/login-page';
import { NotFoundPage } from './notfound-page';
import { RegisterPage } from './register-page';
import { Page } from './abstract/page';
import Footer from '../components/footer/footer';

export class Layout extends Page {
    private appStore: AppStore;

    private header: Header;
    private main: Page;
    private footer: Footer;
    private loginPage: LoginPage;
    private mainEl: HTMLElement;

    constructor(appStore: AppStore) {
        super();
        this.appStore = appStore;

        this.header = new Header(this.appStore);
        this.main = new MainPage();
        this.footer = new Footer(this.appStore);
        this.loginPage = new LoginPage(this.appStore);

        this.mainEl = document.createElement('main');
        this.appStore.addChangeListener(StoreEventType.PAGE_CHANGE, this.onStoreChange.bind(this));
    }

    protected onStoreChange(): void {
        const page: PageName = this.appStore.getCurrentPage();
        switch (page) {
            case PageName.INDEX:
                this.updateMainView(new MainPage());
                break;
            case PageName.LOGIN:
                this.updateMainView(this.loginPage);
                break;
            case PageName.REGISTRATION:
                this.updateMainView(new RegisterPage());
                break;
            case PageName.NOT_FOUND:
                this.updateMainView(new NotFoundPage());
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
        document.body.append(this.header.getHtml(), this.mainEl, this.footer.getComponent());
    }
}
