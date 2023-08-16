import { AppStore } from '../../store/app-store';
import { PageName, StoreEventType } from '../../types';
import { RouteAction } from '../../store/action/routeAction';
import { Component } from '../component';

export class Header implements Component {
    private appStore: AppStore;
    private html?: HTMLElement;

    private navEl: HTMLElement[];
    private selectedEl?: HTMLElement;
    private routeAction: RouteAction;

    constructor(appStore: AppStore) {
        this.appStore = appStore;
        this.routeAction = new RouteAction();
        this.navEl = [];
        this.appStore.addChangeListener(StoreEventType.PAGE_CHANGE, this.onStoreChange.bind(this));
    }

    protected onStoreChange(): void {
        const page: PageName = this.appStore.getCurrentPage();
        const selected = this.navEl.find((item) => item.dataset.page === page);
        if (selected) {
            this.selectedEl?.classList.remove('selected');
            selected.classList.add('selected');
            this.selectedEl = selected;
        }
    }

    private addNavItem(text: string, page: PageName, selected = false): void {
        const a = document.createElement('a');
        a.textContent = text;
        this.navEl.push(a);
        if (selected) {
            a.classList.add('selected');
            this.selectedEl = a;
        }
        a.dataset.page = page;
        a.addEventListener('click', (event: Event) => this.changePage(event));
    }

    private changePage(event: Event): void {
        const newPage: PageName = (event.target as HTMLElement).dataset.page as PageName;
        this.routeAction.changePage({ addHistory: true, page: newPage });
    }

    public render(): void {
        this.html = document.createElement('header');
        this.addNavItem('Main', PageName.INDEX, true);
        this.addNavItem('Login', PageName.LOGIN);
        this.addNavItem('Registration', PageName.REGISTRATION);
        this.addNavItem('Not found', PageName.NOT_FOUND);
        this.navEl.forEach((item) => {
            this.html?.append(item);
        });
    }

    public getHtml(): HTMLElement {
        return this.html as HTMLElement;
    }
}
