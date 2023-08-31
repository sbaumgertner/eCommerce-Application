import { ActionType, AddressData } from '../../types';
import { AbstractAction } from '../abstract/action';

export type AccountActionData = {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    shippingAddress?: AddressData;
    billingAddress?: AddressData;
};

export class AcountAction extends AbstractAction {
    public changePassword(data: AccountActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.CHANGE_PASSWORD, data: JSON.stringify(data) });
    }

    public changeEmail(data: AccountActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.CHANGE_EMAIL, data: JSON.stringify(data) });
    }

    public changeCommonInfo(data: AccountActionData): void {
        this.dispatcher.handleAction({ actionType: ActionType.CHANGE_COMMON_INFO, data: JSON.stringify(data) });
    }
}
