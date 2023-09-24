/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { MyCartUpdate } from '@commercetools/platform-sdk';
import { getAPIRootWithExistingTokenFlow, getApiRootForCredentialFlow } from './client';

type CartDraft = {
    currency: string;
    customerEmail?: string;
};

type CartUpdateItemInfo = {
    version: number;
    productId: string;
    quantity: number;
};

type CartRemoveItemInfo = {
    version: number;
    lineItemId: string;
    quantity?: number;
};

type CartAddPromoInfo = {
    version: number;
    code: string;
};

type CartRemovePromoInfo = {
    version: number;
    id: string;
};

export default class CartAPI {
    private isAnonUser: boolean;

    constructor(isAnonUser: boolean) {
        this.isAnonUser = isAnonUser;
    }

    private createCustomerCartDraft(cartData: CartDraft): CartDraft {
        const { currency } = cartData;

        return {
            currency,
        };
    }

    private createCartUpdateDraft(cartUpdateItemInfo: CartUpdateItemInfo): MyCartUpdate {
        const action = 'addLineItem';
        const { version, productId, quantity } = cartUpdateItemInfo;
        return {
            version,
            actions: [
                {
                    action,
                    productId,
                    quantity,
                },
            ],
        };
    }

    private createRemoveItemDraft(cartRemoveItemInfo: CartRemoveItemInfo): MyCartUpdate {
        const action = 'removeLineItem';
        const { version, lineItemId, quantity } = cartRemoveItemInfo;
        return {
            version,
            actions: [
                {
                    action,
                    lineItemId,
                    quantity,
                },
            ],
        };
    }

    private createAddPromocodeDraft(addPromocodeDraft: CartAddPromoInfo): MyCartUpdate {
        const action = 'addDiscountCode';
        const { version, code } = addPromocodeDraft;
        return {
            version,
            actions: [
                {
                    action,
                    code,
                },
            ],
        };
    }

    private createRemovePromocodeDraft(removePromocodeDraft: CartRemovePromoInfo): MyCartUpdate {
        const action = 'removeDiscountCode';
        const { version, id } = removePromocodeDraft;
        return {
            version,
            actions: [
                {
                    action,
                    discountCode: {
                        typeId: 'discount-code',
                        id,
                    },
                },
            ],
        };
    }

    async createCartForAnonymousCustomer(cartDraft: CartDraft) {
        try {
            return getApiRootForCredentialFlow()
                .carts()
                .post({
                    body: this.createCustomerCartDraft(cartDraft),
                })
                .execute()
                .then((data) => localStorage.setItem('cartAnonID', data.body.id));
        } catch (error) {
            return error;
        }
    }

    async createCartForCurrentCustomer(cartDraft: CartDraft) {
        return getAPIRootWithExistingTokenFlow()
            .me()
            .carts()
            .post({
                body: this.createCustomerCartDraft(cartDraft),
            })
            .execute()
            .then((data) => {
                localStorage.setItem('cartAnonID', data.body.id);
            });
    }

    async getActiveCart(cartId: string) {
        let activeCart;
        if (this.isAnonUser) {
            activeCart = await getApiRootForCredentialFlow().carts().withId({ ID: cartId }).get().execute();
        } else {
            activeCart = await getAPIRootWithExistingTokenFlow().me().carts().withId({ ID: cartId }).get().execute();
        }

        return activeCart;
    }

    async updateActiveCart(productDetails: { cartId: string; cartUpdateItemInfo: CartUpdateItemInfo }) {
        let activeCart;
        const { cartId, cartUpdateItemInfo } = productDetails;
        if (this.isAnonUser) {
            activeCart = await getApiRootForCredentialFlow()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createCartUpdateDraft(cartUpdateItemInfo) })
                .execute();
        } else {
            console.log('updateActiveCart logged');
            activeCart = await getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createCartUpdateDraft(cartUpdateItemInfo) })
                .execute();
        }
        return activeCart;
    }

    async removeLineItem(cartId: string, productDetails: CartRemoveItemInfo) {
        let activeCart;
        if (this.isAnonUser) {
            activeCart = await getApiRootForCredentialFlow()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createRemoveItemDraft(productDetails) })
                .execute();
        } else {
            activeCart = await getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createRemoveItemDraft(productDetails) })
                .execute();
        }
        return activeCart;
    }

    async addPromocode(cartId: string, cartAddPromoInfo: CartAddPromoInfo) {
        let activeCart;
        if (this.isAnonUser) {
            activeCart = await getApiRootForCredentialFlow()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createAddPromocodeDraft(cartAddPromoInfo) })
                .execute();
        } else {
            activeCart = await getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createAddPromocodeDraft(cartAddPromoInfo) })
                .execute();
        }
        return activeCart;
    }

    async removePromocode(cartId: string, cartRemovePromoInfo: CartRemovePromoInfo) {
        let activeCart;
        if (this.isAnonUser) {
            activeCart = await getApiRootForCredentialFlow()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createRemovePromocodeDraft(cartRemovePromoInfo) })
                .execute();
        } else {
            activeCart = await getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createRemovePromocodeDraft(cartRemovePromoInfo) })
                .execute();
        }
        return activeCart;
    }
}
