import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

export default class MyToken implements TokenCache {
    private cache: TokenStore = {
        token: '',
        expirationTime: 0,
        refreshToken: undefined,
    };

    get(): TokenStore {
        return this.cache;
    }

    set(cache: TokenStore): void {
        this.cache = cache;
    }
}
