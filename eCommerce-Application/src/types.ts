export enum PageName {
    INDEX = 'INDEX',
    LOGIN = 'LOGIN',
    REGISTRATION = 'REGISTRATION',
    CATALOG = 'CATALOG',
    ABOUT_US = 'ABOUT_US',
    NOT_FOUND = 'NOT_FOUND',
}

export type Page = {
    name: PageName;
    url: string;
};

export enum ActionType {
    ROUTE_CHANGE = 'ROUTE_CHANGE',
}

export type Action = {
    actionType: ActionType;
    data: string;
};

export enum StoreEventType {
    PAGE_CHANGE = 'PAGE_CHANGE',
}

export type ElementParams = {
    tag: string;
    classes: string[];
    id?: string;
    text?: string;
};

export type CreatorGithubInfo = {
    name: string;
    link: string;
};

export type LinkProps = {
    page: PageName;
    text: string;
};
