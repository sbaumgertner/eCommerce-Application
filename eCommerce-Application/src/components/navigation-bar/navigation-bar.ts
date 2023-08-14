import './navigation-bar.scss';
import { ElementParams, PageName, StoreEventType } from '../../types';
import Component from '../abstract/component';
import NavLink from '../link-navigation/link-navigation';
import { RouteAction } from '../../store/action/routeAction';
import { AppStore } from '../../store/app-store';

export default class NavigationBar extends Component {
    private appStore: AppStore;
    private routeAction: RouteAction = new RouteAction();
    private selectedEl?: HTMLElement;
    private navEl: HTMLElement[] = [];

    constructor(appStore: AppStore, pagesName: PageName[], color: 'light' | 'dark' = 'dark') {
        const navigationBarParams: ElementParams = {
            tag: 'nav',
            classes: ['nav-bar'],
        };
        super(navigationBarParams);
        this.appStore = appStore;
        this.appStore.addChangeListener(StoreEventType.PAGE_CHANGE, this.onStoreChange.bind(this));
        this.render(pagesName, color);
    }

    public render(pagesName: PageName[], color: 'light' | 'dark' = 'dark'): void {
        this.componentElem.innerHTML = '';
        pagesName.forEach((pageName) => {
            const link = new NavLink(pageName, color);
            const linkEl = link.getComponent();
            linkEl.addEventListener('click', (event: Event) => this.changePage(event));
            this.navEl.push(linkEl);
            this.componentElem.append(linkEl);
        });
    }

    protected onStoreChange(): void {
        const page: PageName = this.appStore.getCurrentPage();
        const selected = this.navEl.find((item) => item.dataset.page === page);
        this.selectedEl?.classList.remove('current');
        if (selected) {
            selected.classList.add('current');
            this.selectedEl = selected;
        }
    }

    private changePage(event: Event): void {
        const newPage: PageName = ((event.target as HTMLElement).closest('.nav-link') as HTMLElement).dataset
            .page as PageName;
        this.routeAction.changePage({ addHistory: true, page: newPage });
    }
}
