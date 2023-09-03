/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { QueryParam } from '@commercetools/typescript-sdk';
import { getApiRootForCredentialFlow } from './client';

type GetProductsMethodArgs = {
    queryArgs?: {
        where?: string | string[];
        priceCurrency?: string;
        priceCountry?: string;
        priceCustomerGroup?: string;
        priceChannel?: string;
        localeProjection?: string | string[];
        expand?: string | string[];
        sort?: string | string[];
        limit?: number;
        offset?: number;
        withTotal?: boolean;
        [key: string]: QueryParam;
    };
    headers?: {
        [key: string]: string | string[];
    };
};

export function getProducts(methodArgs: GetProductsMethodArgs) {
    return getApiRootForCredentialFlow()
        .productProjections()
        .search()
        .get(methodArgs)
        .execute()
        .then((resp) => resp.body);
}
