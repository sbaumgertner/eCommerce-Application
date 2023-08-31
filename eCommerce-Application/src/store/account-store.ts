import { Action, ActionType, StoreEventType } from '../types';
import { Store } from './abstract/store';

import { manageEcom } from '../api/manageEcom';
import { AccountActionData } from './action/accountAction';
import { getSuccessMessage } from '../utils/getSuccessMessage';

export type AccountValidationErrors = Partial<AccountActionData>;

// const userInformation = {
//     firstName: '',
//     lastName: '',
//     birthDate: '',
//     email: '',
//     password: '',
//     shippingAddress: '',
//     billingAddress: '',
// };

export class AccountStore extends Store {
    private validationErrors: AccountValidationErrors;
    private changeError?: string;
    private manageEcom: manageEcom;
    private firstName: string;
    private lastName: string;
    private birthDate: string;
    private email: string;
    private version: number;

    constructor() {
        super();
        this.validationErrors = {};
        this.manageEcom = new manageEcom();
        this.firstName = '';
        this.lastName = '';
        this.birthDate = '';
        this.email = '';
        this.version = this.getVersionAPI();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public getCustomerInfo() {
        return this.manageEcom.getCustomerById();
    }

    public getEmailInfo(emailInfo: HTMLElement): void {
        this.getCustomerInfo().then((data) => {
            emailInfo.innerHTML = data.body.email;
            this.email = emailInfo.innerHTML;
        });
    }

    public getFullCustomerName(fullName: HTMLElement): void {
        const getFirstName = this.getCustomerInfo().then((data) => {
            fullName.innerHTML = data.body.firstName as string;
        });
        const getLastName = this.getCustomerInfo().then((data) => {
            fullName.innerHTML += ` ${data.body.lastName as string}`;
        });
        try {
            Promise.all([getFirstName, getLastName]);
        } catch (error) {
            alert(error);
        }
    }

    public getFirstName(firstName: HTMLElement): void {
        this.getCustomerInfo().then((data) => {
            firstName.innerHTML = data.body.firstName as string;
            this.firstName = firstName.innerHTML;
        });
    }

    public getLastName(lastName: HTMLElement): void {
        this.getCustomerInfo().then((data) => {
            lastName.innerHTML = data.body.lastName as string;
            this.lastName = lastName.innerHTML;
        });
    }

    public getDateOfBirth(dateOfBirth: HTMLElement): void {
        this.getCustomerInfo().then((data) => {
            dateOfBirth.innerHTML = data.body.dateOfBirth as string;
            this.birthDate = dateOfBirth.innerHTML;
        });
    }

    public getAccountError(): string {
        return this.changeError || '';
    }

    // private validateData(data: AccountActionData): boolean {
    //     this.validationErrors = {};
    //     this.loginError = '';

    //     let result: ValidationResult;
    //     result = Validation.checkPassword(data.currentPassword);
    //     if (!result.isValid) {
    //         this.validationErrors.currentPassword = result.error;
    //     }

    //     return result.isValid;
    // }

    private getVersionAPI(): number {
        try {
            this.manageEcom.getCustomerById().then((data) => {
                this.version = data.body.version;
            });
        } catch (error) {
            console.log(error);
        }
        return this.version;
    }

    private onChangePassword(jsonData: string): void {
        const data: AccountActionData = JSON.parse(jsonData);
        const version = this.getVersionAPI();
        this.manageEcom
            .changeCustomerPassword(version, data.currentPassword as string, data.newPassword as string)
            .then(() => {
                this.changeError = '';
                getSuccessMessage('The password has been changed successfuly');
            })
            .catch((error) => {
                this.changeError = error.message;
                this.emit(StoreEventType.ACCOUNT_ERROR);
            });
    }

    private onChangeEmail(jsonData: string): void {
        const data: AccountActionData = JSON.parse(jsonData);
        const version = this.getVersionAPI();
        this.manageEcom
            .changeCustomerEmail(version, data.email as string)
            .then(() => {
                this.changeError = '';
                this.email = data.email as string;
                getSuccessMessage('The email has been changed successfuly');
            })
            .catch((error) => {
                this.changeError = error.message;
                this.emit(StoreEventType.ACCOUNT_ERROR);
            });
    }

    private onChangeCommonInfo(jsonData: string): void {
        const data: AccountActionData = JSON.parse(jsonData);
        const version = this.getVersionAPI();
        this.manageEcom
            .chageCustomerCommonInfo(
                version,
                data.firstName as string,
                data.lastName as string,
                data.birthDate as string
            )
            .then(() => {
                this.changeError = '';
                getSuccessMessage('The common information has been changed successfuly');
                this.firstName = data.firstName as string;
                this.lastName = data.lastName as string;
                this.birthDate = data.birthDate as string;
            })
            .catch((error) => {
                this.changeError = error.message;
                this.emit(StoreEventType.ACCOUNT_ERROR);
            });
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.CHANGE_PASSWORD:
                this.onChangePassword(action.data);
                break;
            case ActionType.CHANGE_EMAIL:
                this.onChangeEmail(action.data);
                break;
            case ActionType.CHANGE_COMMON_INFO:
                this.onChangeCommonInfo(action.data);
                break;
        }
    }
}
