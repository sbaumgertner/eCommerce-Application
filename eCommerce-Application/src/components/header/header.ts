import './header.scss';
import { ElementParams, LinkProps, PageName, StoreEventType } from '../../types';
import Component from '../abstract/component';
import createElement from '../../utils/create-element';
import htmlToElement from '../../utils/html-to-element';
import NavigationBar from '../navigation-bar/navigation-bar';
import { AppStore } from '../../store/app-store';
import { RouteAction } from '../../store/action/routeAction';
import IconWithCounter from '../icon-with-counter/icon-with-counter';
import { UserTypeAction } from '../../store/action/userTypeAction';
import { Button, IconButton } from '../button/button';

import darkLogoImg from '../../assets/logo-dark.svg';
import cartIcon from '../../assets/icons/icon-cart.svg';
import userIcon from '../../assets/icons/icon-user.svg';
import burgerIcon from '../../assets/icons/icon-menu.svg';
import closeIcon from '../../assets/icons/icon-cross.svg';

const HeaderNavLinks: LinkProps[] = [
    {
        page: PageName.CATALOG,
        text: 'Catalog',
    },
    {
        page: PageName.ABOUT_US,
        text: 'About us',
    },
    {
        page: PageName.ACCOUNT,
        text: 'Account',
    },
];

export default class Header extends Component {
    private routeAction: RouteAction = new RouteAction();
    private userAction: UserTypeAction = new UserTypeAction();
    private isAnonUser: boolean;

    private mediaQuery = window.matchMedia('(max-width: 768px)');
    private isMobile = this.handleMobileChange(this.mediaQuery);
    private navigationBar = new NavigationBar(this.appStore, HeaderNavLinks, 'dark').getComponent();

    constructor(private appStore: AppStore) {
        const headerParams: ElementParams = {
            tag: 'header',
            classes: ['header'],
        };
        super(headerParams);
        this.appStore.addChangeListener(StoreEventType.USER_TYPE_CHANGE, this.onUserType.bind(this));
        this.isAnonUser = this.appStore.getIsAnonUser();
        this.mediaQuery.addEventListener('change', (e) => this.handleMobileChange(e));
        this.render();
    }

    protected onUserType(): void {
        this.isAnonUser = this.appStore.getIsAnonUser();
        this.render();
    }

    public render(): void {
        this.componentElem.innerHTML = '';
        this.componentElem.append(this.createWrapper());
    }

    private createWrapper(): HTMLElement {
        const wrapperEl = createElement({ tag: 'div', classes: ['header__wrapper'] });
        const headerNavBar = this.createHeaderNavBar();
        const logoEl = this.createLogo();
        const buttonBarEl = this.createButtonBar();

        wrapperEl.append(headerNavBar, logoEl, buttonBarEl);
        return wrapperEl;
    }

    private createHeaderNavBar(): HTMLElement {
        const headerNavBar = createElement({ tag: 'div', classes: ['header__nav'] });

        if (this.isMobile) {
            headerNavBar.append(this.createBurgerMenu());
        } else {
            headerNavBar.append(this.navigationBar);
        }
        return headerNavBar;
    }

    private createLogo(): HTMLElement {
        const logoEl = htmlToElement(`<a class="header__logo">${darkLogoImg}</div>`);
        logoEl.addEventListener('click', () => this.routeAction.changePage({ addHistory: true, page: PageName.INDEX }));
        return logoEl;
    }

    private createButtonBar(): HTMLElement {
        const btnBarEl = createElement({ tag: 'nav', classes: ['header__btn-bar'] });
        const cartIconEl = this.createCartIcon();
        const userIconEl = this.createUserIcon();
        const loginBtnEl = this.createloginButton();
        const registrationBtnEl = this.createRegistrationButton();

        if (this.isMobile) {
            btnBarEl.append(cartIconEl);
        } else if (this.isAnonUser) {
            btnBarEl.append(cartIconEl, loginBtnEl, registrationBtnEl);
        } else {
            btnBarEl.append(cartIconEl, userIconEl);
        }
        return btnBarEl;
    }

    private createBurgerMenu(): HTMLElement {
        const burgerMenuEl = createElement({ tag: 'div', classes: ['header__burger-menu'] });
        const burgerButtonEl = new IconButton({ icon: burgerIcon, type: 'clear' }).getComponent();
        const closeButtonEl = new IconButton({ icon: closeIcon, type: 'clear' }).getComponent();
        const mobiletMenuEl = this.createMobileMenu();

        burgerButtonEl.classList.add('header__burger-icon');
        closeButtonEl.classList.add('header__close-icon');

        burgerMenuEl.append(burgerButtonEl, closeButtonEl, mobiletMenuEl);

        burgerMenuEl.addEventListener('click', () => {
            burgerMenuEl.classList.toggle('header__burger-menu_active');
            mobiletMenuEl.classList.toggle('header__mobile-menu_active');
        });

        return burgerMenuEl;
    }
    private createMobileMenu(): HTMLElement {
        const mobileMenuEl = createElement({ tag: 'div', classes: ['header__mobile-menu'] });
        const loginBtnEl = this.createloginButton();
        const registrationBtnEl = this.createRegistrationButton();
        const logoutBtnEl = this.createLogoutButton();

        if (this.isAnonUser) {
            this.navigationBar?.classList.remove('nav-bar_auth');
            mobileMenuEl.append(this.navigationBar, loginBtnEl, registrationBtnEl);
        } else {
            this.navigationBar?.classList.add('nav-bar_auth');
            mobileMenuEl.append(this.navigationBar, logoutBtnEl);
        }

        return mobileMenuEl;
    }

    private createCartIcon(): HTMLElement {
        const cartIconInstance = new IconWithCounter(cartIcon, 'clear', 0);
        const cartIconEl = cartIconInstance.getComponent();

        // поменять на лиснер изменения в сторе корзины
        cartIconEl.addEventListener('click', () => {
            cartIconInstance.setCount(Number(cartIconEl.dataset.count) + 1);
        });

        cartIconEl.addEventListener('click', () =>
            this.routeAction.changePage({ addHistory: true, page: PageName.CART })
        );

        return cartIconEl;
    }

    private createUserIcon(): HTMLElement {
        const userIconEl = createElement({ tag: 'div', classes: ['header__user-icon'] });
        const userButtonEl = new IconButton({ icon: userIcon, type: 'clear' }).getComponent();
        const accountMenuEl = this.createAccountMenu();

        userIconEl.append(userButtonEl, accountMenuEl);

        userIconEl.addEventListener('click', () => {
            userIconEl.classList.toggle('header__user-icon_active');
            accountMenuEl.classList.toggle('header__sub-menu_active');
        });

        return userIconEl;
    }

    private createloginButton(): HTMLElement {
        const loginButton = new Button('text', 'nav-login', 'Login');
        const loginBtnEl = loginButton.getComponent();

        loginBtnEl.addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.LOGIN });
        });
        return loginBtnEl;
    }

    private createRegistrationButton(): HTMLElement {
        const registrationBtn = new Button('bordered', 'nav-registration', 'Registration');
        const registrationBtnEl = registrationBtn.getComponent();

        registrationBtnEl.addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.REGISTRATION });
        });
        return registrationBtnEl;
    }

    private createAccountMenu(): HTMLElement {
        const accountMenuEl = createElement({ tag: 'div', classes: ['header__sub-menu'] });
        const logoutBtnEl = this.createLogoutButton();
        const navBar = new NavigationBar(
            this.appStore,
            [{ page: PageName.ACCOUNT, text: 'Account' }],
            'dark'
        ).getComponent();

        accountMenuEl.append(navBar, logoutBtnEl);
        return accountMenuEl;
    }

    private createLogoutButton(): HTMLElement {
        const logoutBtn = new Button('bordered', 'nav-logout', 'Logout');
        const logoutBtnEl = logoutBtn.getComponent();
        logoutBtnEl.classList.add('button_bordered_negative');

        logoutBtnEl.addEventListener('click', () => {
            this.userAction.changeUserType(true);
            localStorage.removeItem('token');
            this.routeAction.changePage({ addHistory: true, page: PageName.INDEX });
        });
        return logoutBtnEl;
    }

    private handleMobileChange(event: MediaQueryList | MediaQueryListEvent): boolean {
        if (event.matches) {
            this.isMobile = true;
            this.render();
        } else {
            this.isMobile = false;
            this.render();
        }
        return event.matches;
    }
}
