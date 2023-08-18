import { ActionType } from '../../types';
import { Action } from '../abstract/action';

export type LoginActionData = {
    email: string;
    password: string;
};

export class LoginAction extends Action {
    public login(data: LoginActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.LOGIN, data: JSON.stringify(data) });
    }
}
