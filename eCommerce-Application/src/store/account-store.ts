/* eslint-disable max-lines-per-function */
import { Action, ActionType, AddressData, StoreEventType } from '../types';
import { Store } from './abstract/store';

import { CustomerAddress, manageEcom } from '../api/manageEcom';
import { AccountActionData, addressID } from './action/accountAction';
import { getSuccessMessage } from '../utils/getSuccessMessage';
import { Address } from '@commercetools/platform-sdk';
import { Validation, ValidationResult } from '../utils/validation';
import { RegSummaryErrors } from './registration-store';

export type AccountValidationErrors = Partial<AccountActionData>;

export class AccountStore extends Store {
    private validationErrors: AccountValidationErrors;
    private changeError?: string;
    public manageEcom: manageEcom;
    private firstName: string;
    private lastName: string;
    private birthDate: string;
    public email: string;
    private version: number;
    private adresses: Address[];
    private summaryErrors?: RegSummaryErrors;

    constructor() {
        super();
        this.validationErrors = {};
        this.manageEcom = new manageEcom();
        this.firstName = '';
        this.lastName = '';
        this.birthDate = '';
        this.email = '';
        this.adresses = [];
        this.version = this.getVersionAPI();
    }
    public getSummaryErrors(): RegSummaryErrors | undefined {
        return this.summaryErrors;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public getCustomerInfo() {
        return this.manageEcom.getCustomerById();
    }

    public getEmailInfo(emailInfo: HTMLElement): string {
        this.getCustomerInfo()
            .then((data) => {
                emailInfo.innerHTML = data.body.email;
                this.email = emailInfo.innerHTML;
            })
            .catch((error) => {
                console.log(error);
            });
        return this.email;
    }

    public getEmail(): void {
        this.getCustomerInfo()
            .then((data) => {
                this.email = data.body.email;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    public returnEmail(): string {
        this.getEmail();
        return this.email;
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
        this.getCustomerInfo()
            .then((data) => {
                firstName.innerHTML = data.body.firstName as string;
                this.firstName = firstName.innerHTML;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    public getLastName(lastName: HTMLElement): void {
        this.getCustomerInfo()
            .then((data) => {
                lastName.innerHTML = data.body.lastName as string;
                this.lastName = lastName.innerHTML;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    public getDateOfBirth(dateOfBirth: HTMLElement): void {
        this.getCustomerInfo()
            .then((data) => {
                dateOfBirth.innerHTML = data.body.dateOfBirth as string;
                this.birthDate = dateOfBirth.innerHTML;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    public getAdresses(): object {
        this.getCustomerInfo()
            .then((data) => {
                data.body.addresses.forEach((item) => {
                    this.adresses.push(item);
                });
            })
            .catch((error) => {
                console.log(error);
            });
        return this.adresses;
    }

    public getAccountError(): string {
        return this.changeError || '';
    }

    public getValidationErrors(): AccountValidationErrors | undefined {
        return this.validationErrors;
    }

    public returnAddresses(): Address[] {
        return this.adresses;
    }

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

    private validatePassword(data: AccountActionData): boolean {
        this.validationErrors = {};
        let result: ValidationResult = Validation.checkPassword(data.currentPassword as string);
        if (!result.isValid) {
            this.validationErrors.currentPassword = result.error;
        }
        result = Validation.checkPassword(data.newPassword as string);
        if (!result.isValid) {
            this.validationErrors.newPassword = result.error;
        }
        return result.isValid;
    }

    private validateCommonData(data: AccountActionData): boolean {
        this.validationErrors = {};
        let result: ValidationResult = Validation.checkText(data.firstName as string);
        if (!result.isValid) {
            this.validationErrors.firstName = result.error;
        }
        result = Validation.checkText(data.lastName as string);
        if (!result.isValid) {
            this.validationErrors.lastName = result.error;
        }
        result = Validation.checkDate(data.birthDate as string);
        if (!result.isValid) {
            this.validationErrors.birthDate = result.error;
        }
        return result.isValid;
    }

    private onChangePassword(jsonData: string): void {
        const data: AccountActionData = JSON.parse(jsonData);
        const version = this.getVersionAPI();
        this.validatePassword(data);
        if (this.validatePassword(data) == true) {
            this.manageEcom
                .changeCustomerPassword(version, data.currentPassword as string, data.newPassword as string)
                .then(() => {
                    this.changeError = '';
                    getSuccessMessage('The password has been changed successfuly');
                })
                .catch((error) => {
                    (document.querySelector('.api-error') as HTMLElement).innerHTML = error.message;
                });
        }
        this.emit(StoreEventType.ACCOUNT_ERROR);
    }

    private validateEmail(data: AccountActionData): boolean {
        const result: ValidationResult = Validation.checkEmail(data.email as string);
        if (!result.isValid) {
            this.validationErrors.email = result.error;
        }
        return result.isValid;
    }

    private onChangeEmail(jsonData: string): void {
        const data: AccountActionData = JSON.parse(jsonData);
        const version = this.getVersionAPI();
        this.validateEmail(data);
        if (this.validateEmail(data) == true) {
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
        this.emit(StoreEventType.ACCOUNT_ERROR);
    }

    private onChangeCommonInfo(jsonData: string): void {
        const data: AccountActionData = JSON.parse(jsonData);
        const version = this.getVersionAPI();
        this.validateCommonData(data);
        if (this.validateCommonData(data) == true && data.firstName != '' && data.lastName != '') {
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
                    this.emit(StoreEventType.ACCOUNT_ERROR);
                })
                .catch((error) => {
                    this.changeError = error.message;
                });
        }

        this.emit(StoreEventType.ACCOUNT_ERROR);
    }

    private validateNewAddressData(data: AccountActionData): boolean {
        this.validationErrors = {};

        let isValid: boolean = Object.values(this.validationErrors).length === 0;

        if (data.shippingAddress) {
            this.validationErrors.shippingAddress = this.validateAddress(data.shippingAddress);
            if (!Object.values(this.validationErrors.shippingAddress).every((item) => item === '')) {
                isValid = false;
            }
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

    private onAddNewAddress(jsonData: string): void {
        const data: AccountActionData = JSON.parse(jsonData);
        const isValid: boolean = this.validateNewAddressData(data);
        if (isValid) {
            let shippingAddress: CustomerAddress = {
                country: '',
            };
            let billingAddress: CustomerAddress = {
                country: '',
            };
            if (
                data.shippingAddress &&
                data.billingAddress &&
                data.shippingAddress.isDefault &&
                data.billingAddress.isDefault
            ) {
                shippingAddress = {
                    country: data.shippingAddress.country,
                    streetName: data.shippingAddress.street,
                    postalCode: data.shippingAddress.zip,
                    city: data.shippingAddress.city,
                    region: data.shippingAddress.state,
                };

                this.manageEcom
                    .getCustomerById()
                    .then((data) => {
                        this.version = data.body.version;
                        this.manageEcom.addNewAddress(data.body.version, shippingAddress);
                        return data.body.version;
                    })
                    .then((version) => {
                        this.manageEcom
                            .getCustomerById()
                            .then((data) => {
                                const id = data.body.addresses[data.body.addresses.length - 1].id as string;
                                this.manageEcom.addAddress(version + 1, id);
                            })
                            .catch((error) => {
                                this.changeError = error.message;
                            });
                    })
                    .catch((error) => {
                        this.changeError = error.message;
                    })
                    .then(() => {
                        this.changeError = '';
                        getSuccessMessage('The address is added');
                        //this.adresses = data.body.addresses;
                    });
            }
            if (data.shippingAddress && data.billingAddress == undefined) {
                const defaultShippingAddress = data.shippingAddress.isDefault;
                shippingAddress = {
                    country: data.shippingAddress.country,
                    streetName: data.shippingAddress.street,
                    postalCode: data.shippingAddress.zip,
                    city: data.shippingAddress.city,
                    region: data.shippingAddress.state,
                };
                const version = this.getVersionAPI();

                this.manageEcom
                    .addNewAddress(version, shippingAddress)
                    .then((data) => {
                        this.changeError = '';
                        getSuccessMessage('The address is added');
                        this.adresses = data.body.addresses;
                        const id = data.body.addresses[data.body.addresses.length - 1].id as string;
                        this.manageEcom
                            .addShippingAddressID(version + 1, id)
                            .catch((error) => {
                                this.changeError = error.message;
                            })
                            .then(() => {
                                if (defaultShippingAddress) {
                                    this.manageEcom.addShippingDefaultAddress(version + 2, id).catch((error) => {
                                        this.changeError = error.message;
                                    });
                                }
                            });
                    })
                    .catch((error) => {
                        this.changeError = error.message;
                    });
                this.emit(StoreEventType.ACCOUNT_ERROR);
            }

            if (data.billingAddress && data.shippingAddress == undefined) {
                const defaultBillingAddress = data.billingAddress.isDefault;
                billingAddress = {
                    country: data.billingAddress.country,
                    streetName: data.billingAddress.street,
                    postalCode: data.billingAddress.zip,
                    city: data.billingAddress.city,
                    region: data.billingAddress.state,
                };
                const version = this.getVersionAPI();
                this.manageEcom
                    .addNewAddress(version, billingAddress)
                    .then((data) => {
                        this.changeError = '';
                        getSuccessMessage('The address is added');
                        this.adresses = data.body.addresses;
                        const id = data.body.addresses[data.body.addresses.length - 1].id as string;
                        this.manageEcom
                            .addBillingAddressID(version + 1, id)
                            .catch((error) => {
                                this.changeError = error.message;
                            })
                            .then(() => {
                                if (defaultBillingAddress) {
                                    this.manageEcom.addBillinggDefaultAddress(version + 2, id).catch((error) => {
                                        this.changeError = error.message;
                                    });
                                }
                            });
                    })
                    .catch((error) => {
                        this.changeError = error.message;
                    });
            }
        } else {
            this.summaryErrors = {
                message: 'Please fill in all fields correctly!',
            };
            this.emit(StoreEventType.ACCOUNT_ERROR);
        }
        this.emit(StoreEventType.ACCOUNT_ERROR);
    }

    private onDeleteAddress(jsonData: string): void {
        const data: addressID = JSON.parse(jsonData);
        const version = this.getVersionAPI();
        this.manageEcom
            .removeAddress(version, data.id)
            .then(() => {
                this.changeError = '';
                getSuccessMessage('The address has been removed successfuly');
                this.emit(StoreEventType.ACCOUNT_ERROR);
            })
            .catch((error) => {
                this.changeError = error.message;
            });
        this.emit(StoreEventType.ACCOUNT_ERROR);
    }

    private onEditAddress(jsonData: string): void {
        const data: AccountActionData = JSON.parse(jsonData);
        const isValid: boolean = this.validateNewAddressData(data);
        if (isValid) {
            let shippingAddress: CustomerAddress = {
                country: '',
            };
            let billingAddress: CustomerAddress = {
                country: '',
            };
            if (data.shippingAddress && data.billingAddress) {
                shippingAddress = {
                    country: data.shippingAddress.country,
                    streetName: data.shippingAddress.street,
                    postalCode: data.shippingAddress.zip,
                    city: data.shippingAddress.city,
                    region: data.shippingAddress.state,
                };
                this.manageEcom
                    .getCustomerById()
                    .then((data) => {
                        this.version = data.body.version;
                        return data.body.version;
                    })
                    .then((version) => {
                        const id = localStorage.getItem('buttonId') as string;
                        this.manageEcom.editAllAddress(version, id, shippingAddress);
                    })
                    .catch((error) => {
                        this.changeError = error.message;
                    })
                    .then(() => {
                        this.changeError = '';
                        getSuccessMessage('The address is edited');
                        //this.adresses = data.body.addresses;
                    });
            }
            if (data.shippingAddress && data.billingAddress == undefined) {
                const defaultAddress = data.shippingAddress.isDefault;
                shippingAddress = {
                    country: data.shippingAddress.country,
                    streetName: data.shippingAddress.street,
                    postalCode: data.shippingAddress.zip,
                    city: data.shippingAddress.city,
                    region: data.shippingAddress.state,
                };
                const version = this.getVersionAPI();
                this.manageEcom
                    .editAddress(version, localStorage.getItem('buttonId') as string, shippingAddress)
                    .then(() => {
                        this.changeError = '';
                        getSuccessMessage('The address has been edited successfuly');
                        this.emit(StoreEventType.ACCOUNT_ERROR);
                    })
                    .then(() => {
                        const id = localStorage.getItem('buttonId') as string;
                        this.manageEcom
                            .addShippingAddressID(version + 1, id)
                            .catch((error) => {
                                this.changeError = error.message;
                            })
                            .then(() => {
                                if (defaultAddress) {
                                    this.manageEcom.addShippingDefaultAddress(version + 2, id).catch((error) => {
                                        this.changeError = error.message;
                                    });
                                }
                            });
                    })
                    .catch((error) => {
                        this.changeError = error.message;
                    });
                this.emit(StoreEventType.ACCOUNT_ERROR);
            }
            if (data.billingAddress && data.shippingAddress == undefined) {
                const defaultAddress = data.billingAddress.isDefault;
                billingAddress = {
                    country: data.billingAddress.country,
                    streetName: data.billingAddress.street,
                    postalCode: data.billingAddress.zip,
                    city: data.billingAddress.city,
                    region: data.billingAddress.state,
                };
                const version = this.getVersionAPI();
                this.manageEcom
                    .editAddress(version, localStorage.getItem('buttonId') as string, billingAddress)
                    .then(() => {
                        this.changeError = '';
                        getSuccessMessage('The address has been edited successfuly');
                        this.emit(StoreEventType.ACCOUNT_ERROR);
                    })
                    .then(() => {
                        const id = localStorage.getItem('buttonId') as string;
                        this.manageEcom
                            .addBillingAddressID(version + 1, id)
                            .catch((error) => {
                                this.changeError = error.message;
                            })
                            .then(() => {
                                if (defaultAddress) {
                                    this.manageEcom.addBillinggDefaultAddress(version + 2, id).catch((error) => {
                                        this.changeError = error.message;
                                    });
                                }
                            });
                    })
                    .catch((error) => {
                        this.changeError = error.message;
                    });
                this.emit(StoreEventType.ACCOUNT_ERROR);
            }
        }
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
            case ActionType.ADD_NEW_ADDRESS:
                this.onAddNewAddress(action.data);
                break;
            case ActionType.EDIT_ADDRESS:
                this.onEditAddress(action.data);
                break;
            case ActionType.DELETE_ADDRESS:
                this.onDeleteAddress(action.data);
                break;
        }
    }
}
