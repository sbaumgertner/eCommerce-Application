/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { getAPIRootWithExistingTokenFlow, getApiRootForCredentialFlow } from './client';
import { AppStore } from '../store/app-store';

type CartDraft = {
    currency: string;
    customerEmail?: string;
};

type MyCartUpdate = {
    version: number;
    actions: MyCartUpdateAction[];
};

type MyCartUpdateAction = {
    readonly action: 'addLineItem';
    readonly productId?: string;
    readonly quantity?: number;
};

type MyCartRemoveItem = {
    version: number;
    actions: MyCartRemoveLineItemAction[];
};

type MyCartRemoveLineItemAction = {
    readonly action: 'removeLineItem';
    readonly lineItemId: string;
    readonly quantity?: number;
};

type CartUpdateDraft = {
    version: number;
    productId: string;
    quantity: number;
};

type CartRemoveItemDraft = {
    version: number;
    lineItemId: string;
    quantity?: number;
};

export default class CartAPI {
    private isAnonUser: boolean;

    constructor(private appStore: AppStore) {
        this.isAnonUser = this.appStore.getIsAnonUser();
    }

    private createCustomerCartDraft(cartData: CartDraft): CartDraft {
        const { currency } = cartData;

        return {
            currency,
        };
    }

    private createCartUpdateDraft(cartUpdateDraft: CartUpdateDraft): MyCartUpdate {
        const action = 'addLineItem'; // default value needed to tell the system we are adding an item to cart
        const { version, productId, quantity } = cartUpdateDraft;
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

    private createRemoveItemDraft(cartRemoveItemDraft: CartRemoveItemDraft): MyCartRemoveItem {
        const action = 'removeLineItem'; // default value needed to tell the system we are removing an item from the cart
        const { version, lineItemId, quantity } = cartRemoveItemDraft;
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
        try {
            return getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .post({
                    body: this.createCustomerCartDraft(cartDraft),
                })
                .execute()
                .then((data) => {
                    localStorage.setItem('cartID', data.body.id);
                });
        } catch (error) {
            return error;
        }
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

    async updateActiveCart(productDetails: { cartId: string; cartUpdateDraft: CartUpdateDraft }) {
        let activeCart;
        const { cartId, cartUpdateDraft } = productDetails;
        if (this.isAnonUser) {
            activeCart = await getApiRootForCredentialFlow()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createCartUpdateDraft(cartUpdateDraft) })
                .execute();
        } else {
            activeCart = await getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createCartUpdateDraft(cartUpdateDraft) })
                .execute();
        }
        return activeCart;
    }

    async updateAnonCart(productDetails: { cartId: string; cartUpdateDraft: CartUpdateDraft }) {
        const { cartId, cartUpdateDraft } = productDetails;

        return getApiRootForCredentialFlow()
            .carts()
            .withId({ ID: cartId })
            .post({ body: this.createCartUpdateDraft(cartUpdateDraft) })
            .execute();
        // .then((data) => {
        //     console.log(data.body);
        // });
    }

    async removeLineItem(cartId: string, productDetails: CartRemoveItemDraft) {
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
}
