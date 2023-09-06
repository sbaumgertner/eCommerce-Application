/* eslint-disable max-lines-per-function */
import { getApiRootForCredentialFlow } from '../../src/api/client';
import { ProductsApi } from '../../src/api/productsAPI';

jest.mock('../../src/api/client', () => ({
    getApiRootForCredentialFlow: jest.fn().mockReturnValue({
        products: () => ({
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            get: () => ({
                execute: jest.fn().mockResolvedValue({ body: { results: [] } }),
            }),
        }),
        categories: () => ({
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            get: () => ({
                execute: jest.fn().mockResolvedValue({ body: { results: [] } }),
            }),
        }),
    }),
}));

describe('ProductsApi', () => {
    let productsApi: ProductsApi;

    beforeEach(() => {
        productsApi = new ProductsApi();
    });

    test('returns an empty array when getting the products list', async () => {
        const productsList = await productsApi.getProductsList();

        expect(productsList).toEqual([]);
    });

    test('returns an empty array when getting the products names', async () => {
        const productsNames = await productsApi.getProductsNames();

        expect(productsNames).toEqual([]);
    });

    test('returns an empty array when getting the products descriptions', async () => {
        const productsDescriptions = await productsApi.getProductsDescriptin();

        expect(productsDescriptions).toEqual([]);
    });
});
