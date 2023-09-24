import { ActionType } from '../../types';
import { AbstractAction } from '../abstract/action';

export class UserTypeAction extends AbstractAction {
    public changeUserType(data: boolean): void {
        this.dispatcher.handleAction({ actionType: ActionType.USER_TYPE_CHANGE, data: JSON.stringify(data) });
    }
}
