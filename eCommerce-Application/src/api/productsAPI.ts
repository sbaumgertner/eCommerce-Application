/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LocalizedString, Product } from '@commercetools/platform-sdk';
import { getApiRootForCredentialFlow } from './client';
import { ProductData } from '../types';

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

    async getProductByKey(key: string): Promise<ProductData> {
        const data = await getApiRootForCredentialFlow()
            .products()
            .get({ queryArgs: { where: `key = "${key}"` } })
            .execute();

        const productData = data.body.results[0].masterData.current;
        const categoryId = productData.categories[0].id;
        const category = await this.getCategoryById(categoryId);

        const size = productData.masterVariant.attributes?.find((item) => item.name === 'sizePlants')?.value[
            'label'
        ] as string;
        const age = productData.masterVariant.attributes?.find((item) => item.name === 'agePlants')?.value[
            'label'
        ] as string;

        const images: string[] = productData.masterVariant.images?.map((item) => item.url) as string[];

        const product: ProductData = {
            id: data.body.results[0].key as string,
            name: productData.name['en'],
            category: category,
            description: productData.metaDescription?.['en'] as string,
            price: productData.masterVariant.prices?.[0].value.centAmount as number,
            discountPrice: productData.masterVariant.prices?.[0].discounted?.value.centAmount,
            images: images,
            size: size,
            age: age,
        };

        return product;
    }

    async getCategoryById(id: string): Promise<string> {
        const data = await getApiRootForCredentialFlow()
            .categories()
            .get({ queryArgs: { where: `id = "${id}"` } })
            .execute();

        return data.body.results[0].name['en'];
    }
}
