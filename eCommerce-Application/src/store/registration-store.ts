import { Action, ActionType, StoreEventType } from '../types';
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
    }

    private onRegistration(jsonData: string): void {
        const data: RegistrationActionData = JSON.parse(jsonData);
        this.validateData(data);
        //const firstName = data.firstName;
        //const result: ValidationResult = Validation.checkText(firstName);
        //if (!result.isValid) {
        //    this.firstNameError = result.error;
        this.emit(StoreEventType.REGISTRATION_ERROR);
        //}
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.REGISTRATION:
                this.onRegistration(action.data);
                break;
        }
    }
}
