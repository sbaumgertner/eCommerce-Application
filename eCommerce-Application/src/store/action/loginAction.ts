import { ActionType } from '../../types';
<<<<<<< HEAD
import { AbstractAction } from '../abstract/action';
=======
import { Action } from '../abstract/action';
>>>>>>> b727df6 (feat: add login-store)

export type LoginActionData = {
    email: string;
    password: string;
};

<<<<<<< HEAD
export class LoginAction extends AbstractAction {
=======
export class LoginAction extends Action {
>>>>>>> b727df6 (feat: add login-store)
    public login(data: LoginActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.LOGIN, data: JSON.stringify(data) });
    }
}
