import { AppStore } from '../../store/app-store';
import { PageName } from '../../types';
import NavigationBar from '../navigation-bar/navigation-bar';

export default class LoginNavigationBar extends NavigationBar {
    constructor(appStore: AppStore) {
        super(appStore, [PageName.LOGIN, PageName.REGISTRATION], 'dark');
    }

    protected init(): void {
        this.onStoreChange();
    }
}
