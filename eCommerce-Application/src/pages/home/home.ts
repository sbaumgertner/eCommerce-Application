import './home.scss';
import { Button } from '../../components/button/button';
import NavigationBar from '../../components/navigation-bar/navigation-bar';
import { AppStore } from '../../store/app-store';
import { LinkProps, PageName } from '../../types';
import createElement from '../../utils/create-element';
import { Page } from '../abstract/page';
import { RouteAction } from '../../store/action/routeAction';

const ImplimentedPages: LinkProps[] = [
    {
        page: PageName.INDEX,
        text: 'Home page',
    },
    {
        page: PageName.LOGIN,
        text: 'LOGIN',
    },
    {
        page: PageName.REGISTRATION,
        text: 'REGISTRATION',
    },
];
const NonImplimentedPages: LinkProps[] = [
    {
        page: PageName.ACCOUNT,
        text: 'ACCOUNT',
    },
    {
        page: PageName.CATALOG,
        text: 'CATALOG',
    },
    {
        page: PageName.CART,
        text: 'CART',
    },
    {
        page: PageName.ABOUT_US,
        text: 'ABOUT US',
    },
];

export class HomePage extends Page {
    private routeAction: RouteAction;
    private implimentedPages = new NavigationBar(this.appStore, ImplimentedPages, 'dark').getComponent();
    private nonImplimentedPages = new NavigationBar(this.appStore, NonImplimentedPages, 'dark').getComponent();

    constructor(private appStore: AppStore) {
        super();
        this.routeAction = new RouteAction();
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.append(this.createHeroBanner(), this.createAllLinks());
    }

    private createAllLinks(): HTMLElement {
        const allLinksEl = createElement({ tag: 'section', classes: ['all-links'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'all-links__wrapper'] });
        const titleImplemented = createElement({
            tag: 'h3',
            classes: ['all-links__title'],
            text: 'Implemented pages',
        });
        const titleNonImplemented = createElement({
            tag: 'h3',
            classes: ['all-links__title'],
            text: 'Non implemented pages',
        });
        const textNonImplemented = createElement({
            tag: 'p',
            classes: ['all-links__text'],
            text: 'Expected navigation result page 404',
        });

        wrapperEl.append(
            titleImplemented,
            this.implimentedPages,
            titleNonImplemented,
            textNonImplemented,
            this.nonImplimentedPages
        );
        allLinksEl.append(wrapperEl);
        return allLinksEl;
    }

    private createHeroBanner(): HTMLElement {
        const heroBannerEl = createElement({ tag: 'section', classes: ['hero-banner'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'hero-banner__wrapper'] });
        const titleEl = createElement({
            tag: 'div',
            classes: ['hero-banner__title'],
            text: 'Discover Serenity in Greenery',
        });
        const btnEl = new Button('filled', 'hero-btn', 'Shop Now!').getComponent();

        btnEl.addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.CATALOG });
        });

        wrapperEl.append(titleEl, btnEl);
        heroBannerEl.append(wrapperEl);
        return heroBannerEl;
    }
}
