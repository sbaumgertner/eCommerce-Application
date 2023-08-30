/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { getApiRootForCredentialFlow } from './client';

export function getProducts() {
    return getApiRootForCredentialFlow()
        .products()
        .get()
        .execute()
        .then((resp) => resp.body);
}
