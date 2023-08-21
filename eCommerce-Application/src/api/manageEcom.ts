import { BaseAddress } from '@commercetools/platform-sdk';
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
}
