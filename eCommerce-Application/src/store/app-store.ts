import { RouteActionData } from './action/routeAction';
import { Router } from '../router';
import { Action, ActionType, PageName, StoreEventType } from '../types';
import { Store } from './abstract/store';

const pagesForLoggedInUser: PageName[] = [
    PageName.ABOUT_US,
    PageName.ACCOUNT,
    PageName.CART,
    PageName.PRODUCT,
    PageName.CATALOG,
    PageName.INDEX,
    PageName.NOT_FOUND,
];
const pagesForAnonUser: PageName[] = [
    PageName.ABOUT_US,
    PageName.CART,
    PageName.PRODUCT,
    PageName.CATALOG,
    PageName.INDEX,
    PageName.NOT_FOUND,
    PageName.LOGIN,
    PageName.REGISTRATION,
];
const CategoriesArr = ['alocasia', 'cactus', 'monstera', 'philodendron', 'syngonium'];
const ProductIDArr = [
    '10101',
    '10102',
    '10103',
    '10201',
    '10202',
    '10203',
    '10301',
    '10302',
    '10303',
    '10401',
    '10402',
    '10403',
    '10501',
    '10502',
    '10503',
    '10601',
    '10602',
    '10603',
    '10701',
    '10702',
    '10703',
    '10801',
    '10802',
    '10803',
    '10901',
    '10902',
    '10903',
    '11001',
    '11002',
    '11003',
];

export type PromocodeInfo = {
    id: string;
    name: string;
    code: string;
    description: string;
};

export const PROMO_CODES_INFO: PromocodeInfo[] = [
    {
        id: '6f5a62ba-b64b-4977-89a9-c1ba2929f8cd',
        name: 'Discount 50%',
        code: 'PROMO-50',
        description: `Products without discount
        Any total amount`,
    },
    {
        id: '52315dab-d4a5-4556-ab70-039c06840c31',
        name: 'Discount 30%',
        code: 'PROMO-30',
        description: `All production
        Any total amount`,
    },
    {
        id: '98c66c66-f849-45c2-bc4e-04669d7d5035',
        name: 'Discount $45',
        code: 'PROMO-45USD',
        description: `All production
        Cart total amount from $100`,
    },
];

export class AppStore extends Store {
    private currentPage: PageName;
    private currentPageResource?: string;
    private router: Router;
    private isAnonUser: boolean;

    constructor(router: Router) {
        super();
        this.router = router;
        this.currentPage = PageName.INDEX;
        this.isAnonUser = !localStorage.getItem('token');
    }

    public getCurrentPage(): PageName {
        return this.currentPage;
    }

    public getCurrentPageResource(): string {
        return this.currentPageResource || '';
    }

    private onRouteChange(jsonData: string): void {
        const data: RouteActionData = JSON.parse(jsonData);
        this.currentPageResource = undefined;
        if (this.isAnonUser && data.page === PageName.ACCOUNT) {
            this.currentPage = PageName.LOGIN;
            data.addHistory = true;
        } else if (
            (this.isAnonUser && pagesForAnonUser.includes(data.page)) ||
            (!this.isAnonUser && pagesForLoggedInUser.includes(data.page))
        ) {
            if (data.resource && !this.hasResource(data.page, data.resource)) {
                this.currentPage = PageName.NOT_FOUND;
            } else {
                this.currentPage = data.page;
                this.currentPageResource = data.resource;
            }
        } else {
            this.currentPage = PageName.INDEX;
            data.addHistory = true;
        }
        if (data.addHistory) {
            this.router.addHistory(this.currentPage, this.currentPageResource);
        }
        this.emit(StoreEventType.PAGE_CHANGE);
    }

    private hasResource(page: PageName, resource: string): boolean {
        switch (page) {
            case PageName.CATALOG:
                if (!CategoriesArr.includes(resource)) {
                    return false;
                }
                break;
            case PageName.PRODUCT:
                if (!ProductIDArr.includes(resource)) {
                    return false;
                }
                break;
        }
        return true;
    }

    public getIsAnonUser(): boolean {
        return this.isAnonUser;
    }

    private onUserTypeChange(jsonData: string): void {
        const data: boolean = JSON.parse(jsonData);
        this.isAnonUser = data;
        this.emit(StoreEventType.USER_TYPE_CHANGE);
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.ROUTE_CHANGE:
                this.onRouteChange(action.data);
                break;
            case ActionType.USER_TYPE_CHANGE:
                this.onUserTypeChange(action.data);
                break;
        }
    }
}
