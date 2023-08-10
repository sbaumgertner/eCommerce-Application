import { RouteActionData } from '../app/action/routeAction';
import { Router } from '../app/router';
import { Action, ActionType, PageName, StoreEventType } from '../app/types';
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

    protected actionCallback(action: Action): void {
        const data: RouteActionData = JSON.parse(action.data);
        switch (action.actionType) {
            case ActionType.ROUTE_CHANGE:
                this.currentPage = data.page;
                if (data.addHistory) {
                    this.router.addHistory(this.currentPage);
                }
                this.emit(StoreEventType.PAGE_CHANGE);
                break;
        }
    }
}
