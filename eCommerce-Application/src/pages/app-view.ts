import { PageName, StoreEventType } from '../app/types';
import { AppStore } from '../store/app-store';
import { HeaderView } from './view/header-view';
import { IndexView } from './view/index-view';
import { LoginView } from './view/login-view';
import { NotFoundView } from './view/notfound-view';
import { RegisterView } from './view/register-view';
import { StoreView } from './view/abstract/store-view';
import { View } from './view/abstract/view';

export class AppView extends StoreView {
    private headerView: HeaderView;
    private mainView: View;
    private mainEl: HTMLElement;

    constructor(store: AppStore) {
        super(store);

        this.headerView = new HeaderView(this.store as AppStore);
        this.mainView = new LoginView();

        this.mainEl = document.createElement('main');
        this.store.addChangeListener(StoreEventType.PAGE_CHANGE, this.onStoreChange.bind(this));
    }

    protected onStoreChange(): void {
        const page: PageName = (this.store as AppStore).getCurrentPage();
        switch (page) {
            case PageName.INDEX:
                this.updateMainView(new IndexView());
                break;
            case PageName.LOGIN:
                this.updateMainView(new LoginView());
                break;
            case PageName.REGISTRATION:
                this.updateMainView(new RegisterView());
                break;
            case PageName.NOT_FOUND:
                this.updateMainView(new NotFoundView());
                break;
        }
    }

    private updateMainView(view: View): void {
        this.mainEl.innerHTML = '';
        this.mainView = view;
        this.mainView.render();
        this.mainEl.append(this.mainView.getHtml());
    }

    public render(): void {
        this.headerView.render();
        this.mainView.render();
        this.mainEl.append(this.mainView.getHtml());
        document.body.append(this.headerView.getHtml());
        console.log('headerView = ' + this.headerView.getHtml());
        document.body.append(this.mainEl);
    }
}
