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
    PageName.CATALOG,
    PageName.INDEX,
    PageName.NOT_FOUND,
    PageName.LOGIN,
    PageName.REGISTRATION,
];

export class AppStore extends Store {
    private currentPage: PageName;
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

    private onRouteChange(jsonData: string): void {
        const data: RouteActionData = JSON.parse(jsonData);
        if (
            (this.isAnonUser && pagesForAnonUser.includes(data.page)) ||
            (!this.isAnonUser && pagesForLoggedInUser.includes(data.page))
        ) {
            this.currentPage = data.page;
        } else {
            this.currentPage = PageName.INDEX;
        }
        if (data.addHistory) {
            this.router.addHistory(this.currentPage);
        }
        this.emit(StoreEventType.PAGE_CHANGE);
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
