import { getAPIRootWithExistingTokenFlow } from './client';

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
    readonly variantId?: number;
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
    quantity: number;
};

export default class CartAPI {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private createCustomerCartDraft(cartData: CartDraft) {
        const { currency, customerEmail } = cartData;

        return {
            currency,
            customerEmail,
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async createCartForCurrentCustomer(cartDraft: CartDraft) {
        try {
            const cart = await this.getActiveCart();
            if (cart?.statusCode == 200) return cart;
            return getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .post({
                    body: this.createCustomerCartDraft(cartDraft),
                })
                .execute();
        } catch (error) {
            return error;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getActiveCart() {
        try {
            const activeCart = await getAPIRootWithExistingTokenFlow().me().activeCart().get().execute();

            return activeCart;
        } catch (error) {
            return error;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async updateActiveCart(productDetails: { cartId: string; cartUpdateDraft: CartUpdateDraft }) {
        try {
            // eslint-disable-next-line prefer-const
            let { cartId, cartUpdateDraft } = productDetails;

            const updatedCart = await getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .withId({ ID: cartId })
                .post({ body: this.createCartUpdateDraft(cartUpdateDraft) })
                .execute();

            return updatedCart;
        } catch (error) {
            return error;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async removeLineItem(productDetails: CartRemoveItemDraft) {
        try {
            const { body } = await this.getActiveCart();
            const updatedCart = await getAPIRootWithExistingTokenFlow()
                .me()
                .carts()
                .withId({ ID: body.id })
                .post({ body: this.createRemoveItemDraft(productDetails) })
                .execute();

            return updatedCart;
        } catch (error) {
            return error;
        }
    }
}
