/* eslint-disable no-undef */
export enum PageName {
    INDEX = 'INDEX',
    LOGIN = 'LOGIN',
    REGISTRATION = 'REGISTRATION',
    ACCOUNT = 'ACCOUNT',
    CATALOG = 'CATALOG',
    PRODUCT = 'PRODUCT',
    CART = 'CART',
    ABOUT_US = 'ABOUT_US',
    NOT_FOUND = 'NOT_FOUND',
}

export type Page = {
    name: PageName;
    url: string;
    hasResourse?: boolean;
};

export enum ActionType {
    ROUTE_CHANGE = 'ROUTE_CHANGE',
    USER_TYPE_CHANGE = 'USER_TYPE_CHANGE',
    REGISTRATION = 'REGISTRATION',
    LOGIN = 'LOGIN',
    CHANGE_PASSWORD = 'CHANGE_PASSWORD',
    CHANGE_EMAIL = 'CHANGE_EMAIL',
    CHANGE_COMMON_INFO = 'CHANGE_COMMON_INFO',
    ADD_NEW_ADDRESS = 'ADD_NEW_ADDRESS',
    DELETE_ADDRESS = 'DELETE_ADDRESS',
    EDIT_ADDRESS = 'EDDIT_EDDRESS',
    CART_INC_ITEM = 'CART_INC_ITEM',
    CART_DEC_ITEM = 'CART_DEC_ITEM',
    CART_REMOVE_ITEM = 'CART_REMOVE_ITEM',
    CART_CLEAR = 'CART_CLEAR',
    CART_ADD_PROMO = 'CART_ADD_PROMO',
    CART_REMOVE_PROMO = 'CART_REMOVE_PROMO',
}

export type Action = {
    actionType: ActionType;
    data: string;
};

export enum StoreEventType {
    PAGE_CHANGE = 'PAGE_CHANGE',
    USER_TYPE_CHANGE = 'USER_TYPE_CHANGE',
    REGISTRATION_ERROR = 'REGISTRATION_ERROR',
    LOGIN_ERROR = 'LOGIN_ERROR',
    ACCOUNT_ERROR = 'ACCOUNT_ERROR',
    CART_INC_ITEM = 'CART_INC_ITEM',
    CART_DEC_ITEM = 'CART_DEC_ITEM',
    CART_REMOVE_ITEM = 'CART_REMOVE_ITEM',
    CART_CLEAR = 'CART_CLEAR',
    CART_ITEM_AMOUNT_CHANGE = 'CART_ITEM_AMOUNT_CHANGE',
    CART_PROMO_ERROR = 'CART_PROMO_ERROR',
    CART_PROMO_SUCCESS = 'CART_PROMO_SUCCESS',
    LOGIN = 'LOGIN',
}

export type ElementParams = {
    tag: string;
    classes: string[];
    id?: string;
    text?: string;
};

export type InputElementParams = {
    classes: string[];
    id?: string;
    type: string;
    name: string;
    placeholder?: string;
};

export type SelectElementParams = {
    classes: string[];
    id?: string;
    name?: string;
    placeholder?: string;
    options: Map<string, string>;
};

export type CreatorGithubInfo = {
    name: string;
    link: string;
};

export type AddressData = {
    country: string;
    zip: string;
    state: string;
    city: string;
    street: string;
    isDefault?: boolean;
};

export type LinkProps = {
    page: PageName;
    text: string;
};

export type EcomProductData = {
    id: string;
    name: { en: string };
    categories: { id: string }[];
    key: string;
    masterVariant: {
        prices: {
            value: { centAmount: number };
            discounted: {
                value: { centAmount: number };
            };
        }[];
        attributes: {
            name: string;
            value: {
                key: string;
                label: string;
            };
        }[];
        images: {
            url: string;
        }[];
    };
    metaDescription: { en: string };
    slug: { en: string };
};

export type ProductData = {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: string[];
    size: string;
    age: string;
    productID: string;
};

export type ProductID = string;
export type CartItem = {
    productID: string;
    count: number;
    cartItemId: string;
    price: number;
};

export type CartInteractionProps = {
    type: 'filled' | 'bordered';
    productID: ProductID;
};

export type Promocode = string;

export enum CategoriesImg {
    alocasia = require('./assets/img/category/cat-alocasia.png'),
    syngonium = require('./assets/img/category/cat-syngonium.png'),
    monstera = require('./assets/img/category/cat-monstera.png'),
    cactus = require('./assets/img/category/cat-cactus.png'),
    philodendron = require('./assets/img/category/cat-philodendron.png'),
}
