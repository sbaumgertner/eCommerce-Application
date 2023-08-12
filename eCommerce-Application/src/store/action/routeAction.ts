import { ActionType, PageName } from '../../types';
import { Action } from '../abstract/action';

export type RouteActionData = {
    addHistory: boolean;
    page: PageName;
};

export class RouteAction extends Action {
    public changePage(data: RouteActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.ROUTE_CHANGE, data: JSON.stringify(data) });
    }
}
