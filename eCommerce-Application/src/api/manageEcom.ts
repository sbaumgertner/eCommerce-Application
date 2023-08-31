import { BaseAddress, ClientResponse, Customer } from '@commercetools/platform-sdk';
import { getApiRootForCredentialFlow } from './client';

export type CustomerData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    //countryCode: string;
    //key: string;
    addresses: BaseAddress[];
    shippingAddresses: number[];
    billingAddresses: number[];
    defaultShippingAddress: number;
    defaultBillingAddress: number;
};

export type CustomerAddress = BaseAddress;

export class manageEcom {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    createCustomer(customerData: CustomerData) {
        try {
            const customer = getApiRootForCredentialFlow()
                .customers()
                .post({
                    body: customerData,
                })
                .execute();
            return customer;
        } catch (error) {
            return error;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getCustomerByEmail(username: string) {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const returnCustomerByEmail = () => {
            return getApiRootForCredentialFlow()
                .customers()
                .get({
                    queryArgs: {
                        where: `email = "${username}"`,
                    },
                })
                .execute();
        };
        returnCustomerByEmail()
            .then(({ body }) => {
                // As email addresses must be unique, either 0 or 1 Customers will be returned.
                // If 0, then no Customer exists with this email address.
                if (body.results.length == 0) {
                    console.log('This email address has not been registered.');
                } else {
                    // Since there can be only one Customer resource in the result, it must be the first entry of the results array. This outputs the Customer's id.
                    console.log(body.results[0].id);
                }
            })
            .catch(console.error);
    }

    async getCustomerById(): Promise<ClientResponse<Customer>> {
        const id = localStorage.getItem('id');
        return getApiRootForCredentialFlow()
            .customers()
            .withId({
                ID: id as string,
            })
            .get()
            .execute();
    }

    async chageCustomerCommonInfo(
        version: number,
        firstName: string,
        lastName: string,
        dateOfBirth: string
    ): Promise<ClientResponse<Customer>> {
        const id = localStorage.getItem('id');
        return getApiRootForCredentialFlow()
            .customers()
            .withId({
                ID: id as string,
            })
            .post({
                body: {
                    version: version,
                    actions: [
                        {
                            action: 'setFirstName',
                            firstName: firstName,
                        },
                        {
                            action: 'setLastName',
                            lastName: lastName,
                        },
                        {
                            action: 'setDateOfBirth',
                            dateOfBirth: dateOfBirth,
                        },
                    ],
                },
            })
            .execute();
    }

    async changeCustomerEmail(version: number, email: string): Promise<ClientResponse<Customer>> {
        const id = localStorage.getItem('id');
        return getApiRootForCredentialFlow()
            .customers()
            .withId({
                ID: id as string,
            })
            .post({
                body: {
                    version: version,
                    actions: [
                        {
                            action: 'changeEmail',
                            email: email,
                        },
                    ],
                },
            })
            .execute();
    }

    async getCustomerFistName(): Promise<string> {
        let firstName = '';
        const id = localStorage.getItem('id');
        getApiRootForCredentialFlow()
            .customers()
            .withId({
                ID: id as string,
            })
            .get()
            .execute()
            .then((data) => {
                firstName = data.body.firstName as string;
            });

        return firstName;
    }

    async getCustomerLastName(): Promise<string> {
        let lastName = '';
        const id = localStorage.getItem('id');
        getApiRootForCredentialFlow()
            .customers()
            .withId({
                ID: id as string,
            })
            .get()
            .execute()
            .then((data) => {
                lastName = data.body.lastName as string;
            });

        return lastName;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async changeCustomerPassword(version: number, currentPassword: string, newPassword: string) {
        const ID = localStorage.getItem('id');
        return getApiRootForCredentialFlow()
            .customers()
            .password()
            .post({
                body: {
                    id: ID as string,
                    version: version,
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                },
            })
            .execute();
    }
}
