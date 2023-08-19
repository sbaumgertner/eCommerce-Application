import { ActionType, AddressData } from '../../types';
import { AbstractAction } from '../abstract/action';

export type RegistrationActionData = {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    password: string;
    shippingAddress: AddressData;
    billingAddress?: AddressData;
};

export class RegistrationAction extends AbstractAction {
    public registration(data: RegistrationActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.REGISTRATION, data: JSON.stringify(data) });
    }
}
