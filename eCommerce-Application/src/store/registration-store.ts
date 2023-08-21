import { manageEcom, CustomerData, CustomerAddress } from '../api/manageEcom';
import { Action, ActionType, AddressData, StoreEventType } from '../types';
import { Validation, ValidationResult } from '../utils/validation';
import { Store } from './abstract/store';
import { RegistrationActionData } from './action/registrationAction';

export type RegValidationErrors = Partial<RegistrationActionData>;
export type RegSummaryErrors = {
    message: string;
    detailed?: string[];
};
type ApiRegistrationError = {
    status: number;
    message: string;
    name: string;
    body: {
        errors?: ApiDetailedError[];
    };
};
type ApiDetailedError = {
    code: string;
    message: string;
    field?: string;
    detailedErrorMessage?: string;
};

export class RegistrationStore extends Store {
    private validationErrors: RegValidationErrors;
    private summaryErrors?: RegSummaryErrors;
    private email?: string;
    private password?: string;

    constructor() {
        super();
        this.validationErrors = {};
    }

    public getValidationErrors(): RegValidationErrors | undefined {
        return this.validationErrors;
    }

    public getSummaryErrors(): RegSummaryErrors | undefined {
        return this.summaryErrors;
    }

    private validateData(data: RegistrationActionData): boolean {
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
        let isValid: boolean = Object.values(this.validationErrors).length === 0;

        this.validationErrors.shippingAddress = this.validateAddress(data.shippingAddress);
        if (!Object.values(this.validationErrors.shippingAddress).every((item) => item === '')) {
            isValid = false;
        }
        if (data.billingAddress) {
            this.validationErrors.billingAddress = this.validateAddress(data.billingAddress);
            if (!Object.values(this.validationErrors.billingAddress).every((item) => item === '')) {
                isValid = false;
            }
        }
        return isValid;
    }

    private validateAddress(address: AddressData): AddressData {
        const addressErrors: AddressData = {
            country: '',
            zip: '',
            state: '',
            city: '',
            street: '',
            // isDefault: true,
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

    private async onRegistration(jsonData: string): Promise<void> {
        const data: RegistrationActionData = JSON.parse(jsonData);
        const isValid: boolean = this.validateData(data);
        if (isValid) {
            this.summaryErrors = undefined;
            await this.apiRegistration(data);
        } else {
            this.summaryErrors = {
                message: 'Please fill in the highlighted fields correctly!',
            };
        }
        this.emit(StoreEventType.REGISTRATION_ERROR);
    }

    private async apiRegistration(data: RegistrationActionData): Promise<void> {
        const api = new manageEcom();

        const shippingAddress: CustomerAddress = {
            country: data.shippingAddress.country,
            streetName: data.shippingAddress.street,
            postalCode: data.shippingAddress.zip,
            city: data.shippingAddress.city,
            region: data.shippingAddress.state,
        };

        let billingAddress: CustomerAddress = shippingAddress;
        if (data.billingAddress) {
            billingAddress = {
                country: data.billingAddress.country,
                streetName: data.billingAddress.street,
                postalCode: data.billingAddress.zip,
                city: data.billingAddress.city,
                region: data.billingAddress.state,
            };
        }

        const apiData: CustomerData = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.birthDate,
            addresses: [shippingAddress, billingAddress],
            shippingAddresses: [0],
            billingAddresses: [1],
            defaultShippingAddress: data.shippingAddress.isDefault ? 0 : NaN,
            defaultBillingAddress: data.billingAddress?.isDefault ? 1 : NaN,
        };
        try {
            await api.createCustomer(apiData);
            this.email = data.email;
            this.password = data.password;
        } catch (err) {
            this.handleApiErrors(err as ApiRegistrationError);
        }
    }

    private handleApiErrors(error: ApiRegistrationError): void {
        if (
            error.status === 400 ||
            error.body.errors?.at(0)?.field === 'email' ||
            error.body.errors?.at(0)?.code === 'DuplicateField'
        ) {
            this.summaryErrors = {
                message: `Sorry.${error.message} Try to log in or use another email address`,
            };
            this.validationErrors.email = error.message;
        } else if (error.status >= 400 && error.status < 500) {
            this.summaryErrors = {
                message: `Sorry, somthing wrong with input data.`,
            };
            if (error.body.errors) {
                this.summaryErrors.detailed = [];
                for (let i = 0; i < error.body.errors.length; i += 1) {
                    this.summaryErrors.detailed.push(
                        error.body.errors[i].detailedErrorMessage || error.body.errors[i].message
                    );
                }
            }
        } else {
            this.summaryErrors = {
                message: `Sorry, somthing went wrong. Try again later.`,
            };
        }
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.REGISTRATION:
                this.onRegistration(action.data);
                break;
        }
    }

    public getEmail(): string {
        return this.email || '';
    }

    public getPassword(): string {
        return this.password || '';
    }
}
