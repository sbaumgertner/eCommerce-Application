export enum PageName {
    INDEX = 'INDEX',
    LOGIN = 'LOGIN',
    REGISTRATION = 'REGISTRATION',
    ACCOUNT = 'ACCOUNT',
    CATALOG = 'CATALOG',
    CART = 'CART',
    ABOUT_US = 'ABOUT_US',
    NOT_FOUND = 'NOT_FOUND',
}

export type Page = {
    name: PageName;
    url: string;
};

export enum ActionType {
    ROUTE_CHANGE = 'ROUTE_CHANGE',
    USER_TYPE_CHANGE = 'USER_TYPE_CHANGE',
    REGISTRATION = 'REGISTRATION',
    LOGIN = 'LOGIN',
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
};

export type LinkProps = {
    page: PageName;
    text: string;
};
