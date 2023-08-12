import { RouteActionData } from './action/routeAction';
import { Router } from '../router';
import { Action, ActionType, PageName, StoreEventType } from '../types';
import { Store } from './abstract/store';

export class AppStore extends Store {
    private currentPage: PageName;
    private router: Router;

    constructor(router: Router) {
        super();
        this.router = router;
        this.currentPage = PageName.INDEX;
    }

    public getCurrentPage(): PageName {
        return this.currentPage;
    }

    private onRouteChange(jsonData: string): void {
        const data: RouteActionData = JSON.parse(jsonData);
        this.currentPage = data.page;
        if (data.addHistory) {
            this.router.addHistory(this.currentPage);
        }
        this.emit(StoreEventType.PAGE_CHANGE);
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.ROUTE_CHANGE:
                this.onRouteChange(action.data);
                break;
        }
    }
}
