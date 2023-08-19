import { ActionType } from '../../types';
import { AbstractAction } from '../abstract/action';

export type LoginActionData = {
    email: string;
    password: string;
};

export class LoginAction extends AbstractAction {
    public login(data: LoginActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.LOGIN, data: JSON.stringify(data) });
    }
}
