import { getApiRootForCredentialFlow } from './client';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getCategories = () => {
    return getApiRootForCredentialFlow()
        .categories()
        .get()
        .execute()
        .then((resp) => resp.body);
};
