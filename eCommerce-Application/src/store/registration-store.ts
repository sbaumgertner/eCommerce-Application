import { Action, ActionType, StoreEventType } from '../types';
import { Validation, ValidationResult } from '../utils/validation';
import { Store } from './abstract/store';
import { RegistrationActionData } from './action/registrationAction';

export class RegistrationStore extends Store {
    private firstNameError?: string;

    public getFirstNameError(): string {
        return this.firstNameError || '';
    }

    private onRegistration(jsonData: string): void {
        const data: RegistrationActionData = JSON.parse(jsonData);
        const firstName = data.firstName;
        const result: ValidationResult = Validation.checkText(firstName);
        if (!result.isValid) {
            this.firstNameError = result.error;
            this.emit(StoreEventType.REGISTRATION_ERROR);
        }
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.REGISTRATION:
                this.onRegistration(action.data);
                break;
        }
    }
}
