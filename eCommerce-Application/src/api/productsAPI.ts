/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LocalizedString, Product } from '@commercetools/platform-sdk';
import { getApiRootForCredentialFlow } from './client';

export class ProductsApi {
    async getProductsList() {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const productsList = () => {
            return getApiRootForCredentialFlow().products().get().execute();
        };
        const products: Product[] = [];
        productsList().then(({ body }) => {
            for (let i = 0; i < body.results.length; i += 1) {
                products.push(body.results[i]);
            }
        });
        return products;
    }

    async getProductsNames() {
        const productsNames = () => {
            return getApiRootForCredentialFlow().products().get().execute();
        };
        const names: LocalizedString[] = [];
        productsNames().then(({ body }) => {
            for (let i = 0; i < body.results.length; i += 1) {
                names.push(body.results[i].masterData.current.name);
            }
        });
        return names;
    }

    async getProductsDescriptin() {
        const productsDescriptin = () => {
            return getApiRootForCredentialFlow().products().get().execute();
        };
        const descriptions: (LocalizedString | undefined)[] = [];
        productsDescriptin().then(({ body }) => {
            for (let i = 0; i < body.results.length; i += 1) {
                descriptions.push(body.results[i].masterData.staged.description);
            }
        });
        return descriptions;
    }

    // async getProductsPrices() {
    //     const productsPrices = () => {
    //         return getApiRootForCredentialFlow().products().get().execute();
    //     };
    //     const prices: number[] = [];
    //     productsPrices().then(({ body }) => {
    //         for (let i = 0; i < body.results.length; i += 1) {
    //             prices.push(body.results[i].masterData.staged.variants[i].prices[i].value.centAmount);
    //         }
    //     });
    //     return prices;
    // }
}
