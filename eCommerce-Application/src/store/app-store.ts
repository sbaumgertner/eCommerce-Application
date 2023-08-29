import { RouteActionData } from './action/routeAction';
import { Router } from '../router';
import { Action, ActionType, PageName, StoreEventType } from '../types';
import { Store } from './abstract/store';

const pagesForLoggedInUser: PageName[] = [
    PageName.ABOUT_US,
    PageName.ACCOUNT,
    PageName.CART,
    PageName.CATALOG,
    PageName.INDEX,
    PageName.NOT_FOUND,
];
const pagesForAnonUser: PageName[] = [
    PageName.ABOUT_US,
    PageName.CART,
    PageName.PRODUCT,
    PageName.CATALOG,
    PageName.INDEX,
    PageName.NOT_FOUND,
    PageName.LOGIN,
    PageName.REGISTRATION,
];

export class AppStore extends Store {
    private currentPage: PageName;
    private currentPageResource?: string;
    private router: Router;
    private isAnonUser: boolean;

    constructor(router: Router) {
        super();
        this.router = router;
        this.currentPage = PageName.INDEX;
        this.isAnonUser = !localStorage.getItem('token');
    }

    public getCurrentPage(): PageName {
        return this.currentPage;
    }

    public getCurrentPageResource(): string {
        return this.currentPageResource || '';
    }

    private onRouteChange(jsonData: string): void {
        const data: RouteActionData = JSON.parse(jsonData);
        this.currentPageResource = undefined;
        if (this.isAnonUser && data.page === PageName.ACCOUNT) {
            this.currentPage = PageName.LOGIN;
            data.addHistory = true;
        } else if (
            (this.isAnonUser && pagesForAnonUser.includes(data.page)) ||
            (!this.isAnonUser && pagesForLoggedInUser.includes(data.page))
        ) {
            if (data.resource && !this.hasResource(data.resource)) {
                this.currentPage = PageName.NOT_FOUND;
            } else {
                this.currentPage = data.page;
                this.currentPageResource = data.resource;
            }
        } else {
            this.currentPage = PageName.INDEX;
            data.addHistory = true;
        }
        if (data.addHistory) {
            this.router.addHistory(this.currentPage, this.currentPageResource);
        }
        this.emit(StoreEventType.PAGE_CHANGE);
    }

    private hasResource(resource: string): boolean {
        if (!['1', '2'].includes(resource)) {
            return false;
        }
        return true;
    }

    public getIsAnonUser(): boolean {
        return this.isAnonUser;
    }

    private onUserTypeChange(jsonData: string): void {
        const data: boolean = JSON.parse(jsonData);
        this.isAnonUser = data;
        this.emit(StoreEventType.USER_TYPE_CHANGE);
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.ROUTE_CHANGE:
                this.onRouteChange(action.data);
                break;
            case ActionType.USER_TYPE_CHANGE:
                this.onUserTypeChange(action.data);
                break;
        }
    }
}
