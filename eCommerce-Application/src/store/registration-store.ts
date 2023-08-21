import { Action, ActionType, AddressData, StoreEventType } from '../types';
import { Validation, ValidationResult } from '../utils/validation';
import { Store } from './abstract/store';
import { RegistrationActionData } from './action/registrationAction';

export type RegValidationErrors = Partial<RegistrationActionData>;

export class RegistrationStore extends Store {
    private validationErrors: RegValidationErrors;

    constructor() {
        super();
        this.validationErrors = {};
    }

    public getValidationErrors(): RegValidationErrors | undefined {
        return this.validationErrors;
    }

    private validateData(data: RegistrationActionData): void {
        this.validationErrors = {};
        let result: ValidationResult = Validation.checkText(data.firstName);
        if (!result.isValid) {
            this.validationErrors.firstName = result.error;
        }
        result = Validation.checkText(data.lastName);
        if (!result.isValid) {
            this.validationErrors.lastName = result.error;
        }
        result = Validation.checkText(data.lastName);
        if (!result.isValid) {
            this.validationErrors.lastName = result.error;
        }
        result = Validation.checkDate(data.birthDate);
        if (!result.isValid) {
            this.validationErrors.birthDate = result.error;
        }
        result = Validation.checkEmail(data.email);
        if (!result.isValid) {
            this.validationErrors.email = result.error;
        }
        result = Validation.checkPassword(data.password);
        if (!result.isValid) {
            this.validationErrors.password = result.error;
        }

        this.validationErrors.shippingAddress = this.validateAddress(data.shippingAddress);
        if (data.billingAddress) {
            this.validationErrors.billingAddress = this.validateAddress(data.billingAddress);
        }
    }

    private validateAddress(address: AddressData): AddressData {
        const addressErrors: AddressData = {
            country: '',
            zip: '',
            state: '',
            city: '',
            street: '',
        };

        let result = Validation.checkCountry(address.country);
        if (!result.isValid) {
            addressErrors.country = result.error as string;
        }
        result = Validation.checkZip(address.zip, address.country);
        if (!result.isValid) {
            addressErrors.zip = result.error as string;
        }
        result = Validation.checkText(address.state);
        if (!result.isValid) {
            addressErrors.state = result.error as string;
        }
        result = Validation.checkText(address.city);
        if (!result.isValid) {
            addressErrors.city = result.error as string;
        }
        result = Validation.checkNotEmpty(address.street);
        if (!result.isValid) {
            addressErrors.street = result.error as string;
        }
        return addressErrors;
    }

    private onRegistration(jsonData: string): void {
        const data: RegistrationActionData = JSON.parse(jsonData);
        this.validateData(data);
        this.emit(StoreEventType.REGISTRATION_ERROR);
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.REGISTRATION:
                this.onRegistration(action.data);
                break;
        }
    }
}
