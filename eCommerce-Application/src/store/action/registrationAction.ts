import { ActionType } from '../../types';
import { AbstractAction } from '../abstract/action';

export type RegistrationActionData = {
    firstName: string;
};

export class RegistrationAction extends AbstractAction {
    public registration(data: RegistrationActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.REGISTRATION, data: JSON.stringify(data) });
    }
}
