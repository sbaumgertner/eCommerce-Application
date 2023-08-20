import { AppStore } from '../../store/app-store';
import { PageName } from '../../types';
import NavigationBar from '../navigation-bar/navigation-bar';

export default class LoginNavigationBar extends NavigationBar {
    constructor(appStore: AppStore) {
        super(
            appStore,
            [
                { page: PageName.LOGIN, text: 'Login' },
                { page: PageName.REGISTRATION, text: 'Registration' },
            ],
            'dark'
        );
    }

    protected init(): void {
        this.onStoreChange();
    }
}
