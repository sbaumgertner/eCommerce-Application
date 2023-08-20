import { AppStore } from '../../store/app-store';
import { PageName } from '../../types';
import NavigationBar from '../navigation-bar/navigation-bar';

export default class LoginNavigationBar extends NavigationBar {
    constructor(appStore: AppStore) {
        super(
            appStore,
            [
                { page: PageName.LOGIN, text: PageName.LOGIN },
                { page: PageName.REGISTRATION, text: PageName.REGISTRATION },
            ],
            'dark'
        );
    }

    protected init(): void {
        this.onStoreChange();
    }
}
