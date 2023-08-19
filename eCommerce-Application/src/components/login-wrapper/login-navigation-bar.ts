import { AppStore } from '../../store/app-store';
import { LinkProps, PageName } from '../../types';
import NavigationBar from '../navigation-bar/navigation-bar';

const NavLinks: LinkProps[] = [
    {
        page: PageName.LOGIN,
        text: 'Login',
    },
    {
        page: PageName.REGISTRATION,
        text: 'Registration',
    },
];

export default class LoginNavigationBar extends NavigationBar {
    constructor(appStore: AppStore) {
        super(appStore, NavLinks, 'dark');
    }

    protected init(): void {
        this.onStoreChange();
    }
}
