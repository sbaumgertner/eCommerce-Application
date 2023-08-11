import { ClientResponse, CustomerPagedQueryResponse } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

type CustomerData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    countryCode: string;
    key: string;
};

export default class CustomerAPI {
    async createCustomer(customerData: CustomerData): Promise<unknown> {
        try {
            const customer = apiRoot
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

    async getCustomerByEmail(customerEmail: string): Promise<void> {
        const returnCustomerByEmail = (): Promise<ClientResponse<CustomerPagedQueryResponse>> => {
            return apiRoot
                .customers()
                .get({
                    queryArgs: {
                        where: `email="${customerEmail}"`,
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async loginCustommer(customerEmail: string, customerLoginl: string) {
        return apiRoot
            .me()
            .login()
            .post({
                body: {
                    email: customerEmail,
                    password: customerLoginl,
                },
            })
            .execute();
    }
}
