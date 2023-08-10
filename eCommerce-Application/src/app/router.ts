import { RouteAction } from './action/routeAction';
import { Page, PageName } from './types';

export const pages: Page[] = [
    { name: PageName.INDEX, url: '' },
    { name: PageName.INDEX, url: 'index' },
    { name: PageName.LOGIN, url: 'login' },
    { name: PageName.REGISTRATION, url: 'registration' },
    { name: PageName.NOT_FOUND, url: 'not_found' },
];

export class Router {
    private basePath = '';
    private routeAction: RouteAction;

    constructor() {
        this.routeAction = new RouteAction();
        document.addEventListener('DOMContentLoaded', () => {
            const host: string = window.location.host;
            if (host.includes('localhost')) {
                this.basePath = '/';
            } else if (host.includes('127.0.0.1')) {
                this.basePath = '/eCommerce-Application/eCommerce-Application/dist/';
            } else {
                this.basePath = '/eCommerce-Application/';
            }
            this.navigate();
        });
        window.addEventListener('popstate', this.navigate);
    }

    public addHistory(page: PageName): void {
        const url: string = pages.find((item) => item.name === page)?.url as string;
        window.history.pushState(null, '', this.basePath + url);
    }

    private navigate(): void {
        const url = window.location.pathname.slice(this.basePath.length);
        let page = pages.find((item) => item.url === url)?.name;
        if (!page) {
            page = PageName.NOT_FOUND;
        }
        this.routeAction.changePage({ addHistory: false, page: page });
    }
}
