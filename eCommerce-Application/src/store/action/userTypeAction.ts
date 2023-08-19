import { ActionType } from '../../types';
import { Action } from '../abstract/action';

export class UserTypeAction extends Action {
    public changeUserType(data: boolean): void {
        this.dispatcher.handleAction({ actionType: ActionType.USER_TYPE_CHANGE, data: JSON.stringify(data) });
    }
}
