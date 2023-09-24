import { ActionType, PageName } from '../../types';
import { AbstractAction } from '../abstract/action';

export type RouteActionData = {
    addHistory: boolean;
    page: PageName;
    resource?: string;
};

export class RouteAction extends AbstractAction {
    public changePage(data: RouteActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.ROUTE_CHANGE, data: JSON.stringify(data) });
    }
}
